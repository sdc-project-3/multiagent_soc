import si from 'systeminformation'
import { exec } from 'child_process'
import { promisify } from 'util'
import windowsGpuMonitor from './windowsGpuMonitor.js'

const execAsync = promisify(exec)

// ---------------------------------------------------------------------------
// SystemMonitorService
//
// Single shared background sampler that collects hardware telemetry every
// 1 000 ms and caches the last frame. SSE subscribers are pushed every frame.
// REST clients read the cache directly (never triggers a new collection).
//
// GPU telemetry integrates:
//   • Windows Performance Counters (GPU Engine, GPU Adapter Memory) via windowsGpuMonitor
//   • nvidia-smi for NVIDIA discrete thermal, clock, and power metrics
//   • 60-second rolling historical series for 3D, Copy, Video Decode, Video Processing,
//     Dedicated Memory, Shared Memory, Power, Temperature, and Clocks.
// ---------------------------------------------------------------------------

const MAX_HISTORY_SAMPLES = 60

class SystemMonitorService {
  constructor() {
    this.cachedTelemetry = null
    this.isSampling = false
    this.subscribers = new Set()
    this.intervalId = null
    this.lastSampleTime = 0
    this.staticHardware = null
    this._initDone = false
    // Map of gpuId -> { threeD: [], copy: [], videoDecode: [], videoProcessing: [], dedicatedMem: [], sharedMem: [], power: [], temp: [], coreClk: [] }
    this.gpuHistories = new Map()

    // Step 1: fetch one-time static hardware data
    this._initReady = this._initStaticData()
      .then(() => {
        // Step 2: prime the network baseline BEFORE the first real frame
        return this._primeNetworkBaseline()
      })
      .then(() => {
        this._initDone = true
        // Step 3: collect first real frame immediately
        return this.collectFrame()
      })
      .then(() => {
        // Step 4: start the 1 s interval loop
        this._startInterval()
      })
      .catch((err) => {
        console.error('[Telemetry] Init error:', err.message)
        this._initDone = true
        this._startInterval()
      })
  }

  // ── 1. Static hardware: CPU model, GPU controllers ───────────────────────

  async _initStaticData() {
    const [cpu, graphics] = await Promise.all([si.cpu(), si.graphics()])

    this.staticHardware = {
      cpuModel: `${cpu.manufacturer || ''} ${cpu.brand || ''}`.trim() || 'Generic Processor',
      cpuCores: `${cpu.cores || 0} Threads (${cpu.physicalCores || 0} Physical)`,
      baseSpeedGHz: cpu.speed || 0,
      // Filter virtual / remote-display adapters
      gpuControllers: (graphics.controllers || []).filter(
        (g) =>
          !g.model?.toLowerCase().includes('spacedesk') &&
          !g.model?.toLowerCase().includes('virtual') &&
          !g.model?.toLowerCase().includes('mirror') &&
          !g.model?.toLowerCase().includes('parsec')
      ),
    }

    console.log('[Telemetry] Static hardware ready:', {
      cpu: this.staticHardware.cpuModel,
      gpus: this.staticHardware.gpuControllers.map((g) => g.model),
    })
  }

  // ── 2. Network baseline primer (fixes null rx_sec/tx_sec on first call) ──

  async _primeNetworkBaseline() {
    try {
      await si.networkStats()
      await new Promise((r) => setTimeout(r, 1100))
      console.log('[Telemetry] Network baseline primed')
    } catch (err) {
      console.warn('[Telemetry] Network baseline error (non-fatal):', err.message)
    }
  }

  // ── 3. nvidia-smi query ───────────────────────────────────────────────────

  async _queryNvidiaSmi() {
    try {
      const { stdout } = await execAsync(
        'nvidia-smi ' +
          '--query-gpu=index,name,' +
          'utilization.gpu,utilization.memory,utilization.encoder,utilization.decoder,' +
          'memory.total,memory.used,memory.free,' +
          'temperature.gpu,driver_version,power.draw,' +
          'clocks.current.graphics,clocks.current.memory ' +
          '--format=csv,noheader,nounits',
        { timeout: 1400 }
      )
      if (!stdout?.trim()) return null

      return stdout
        .trim()
        .split('\n')
        .filter((l) => l.trim())
        .map((line) => {
          const p = line.split(',').map((s) => s.trim())
          const tot = parseFloat(p[6]) || 0
          const used = parseFloat(p[7]) || 0
          const enc = parseFloat(p[4])
          const dec = parseFloat(p[5])
          return {
            smiIndex: parseInt(p[0], 10),
            name: p[1],
            utilizationGpu: parseFloat(p[2]) || 0,
            utilizationMem: parseFloat(p[3]) || 0,
            encoderUtil: isNaN(enc) ? null : enc,
            decoderUtil: isNaN(dec) ? null : dec,
            memTotalMB: tot,
            memUsedMB: used,
            memFreeMB: parseFloat(p[8]) || 0,
            memUtilPct: tot > 0 ? (used / tot) * 100 : 0,
            temperature: parseFloat(p[9]) || null,
            driverVersion: p[10] || null,
            powerDrawW: parseFloat(p[11]) || null,
            clockCoreMHz: parseFloat(p[12]) || null,
            clockMemMHz: parseFloat(p[13]) || null,
          }
        })
    } catch {
      return null
    }
  }

  // ── 4. Main collection frame ──────────────────────────────────────────────

  async collectFrame() {
    try {
      const [cpuLoad, cpuSpeed, mem, fsSize, netStats, nvidiaGpus] =
        await Promise.all([
          si.currentLoad(),
          si.cpuCurrentSpeed(),
          si.mem(),
          si.fsSize(),
          si.networkStats(),
          this._queryNvidiaSmi(),
        ])

      // ── CPU ──────────────────────────────────────────────────────────────
      const freqGHz =
        cpuSpeed?.avg ||
        cpuSpeed?.main ||
        this.staticHardware?.baseSpeedGHz ||
        0

      const cpu = {
        model: this.staticHardware?.cpuModel || 'Unknown Processor',
        cores: this.staticHardware?.cpuCores || 'N/A',
        utilization: parseFloat((cpuLoad?.currentLoad ?? 0).toFixed(1)),
        frequency: freqGHz > 0 ? `${freqGHz.toFixed(2)} GHz` : 'N/A',
        coresLoad: (cpuLoad?.cpus || []).map((c, i) => ({
          core: i,
          load: parseFloat(c.load.toFixed(1)),
        })),
      }

      // ── Memory ───────────────────────────────────────────────────────────
      const memTotalGB = (mem?.total || 0) / 1073741824
      const memUsedGB = (mem?.used || 0) / 1073741824
      const memAvailGB = (mem?.available || 0) / 1073741824
      const memUtilPct =
        memTotalGB > 0
          ? parseFloat(((memUsedGB / memTotalGB) * 100).toFixed(1))
          : 0

      const memory = {
        total: `${memTotalGB.toFixed(1)} GB`,
        used: `${memUsedGB.toFixed(1)} GB`,
        available: `${memAvailGB.toFixed(1)} GB`,
        utilization: memUtilPct,
      }

      // ── Disks ─────────────────────────────────────────────────────────────
      const disks = (fsSize || [])
        .filter((f) => f.size > 0)
        .map((f) => {
          const sizeGB = f.size / 1073741824
          const usedGB = f.used / 1073741824
          const availGB = (f.available || 0) / 1073741824
          return {
            mount: f.mount || f.fs || 'Drive',
            type: f.type || 'NTFS',
            size: `${sizeGB.toFixed(1)} GB`,
            used: `${usedGB.toFixed(1)} GB`,
            available: `${availGB.toFixed(1)} GB`,
            utilization: parseFloat(
              (f.use ?? (sizeGB > 0 ? (usedGB / sizeGB) * 100 : 0)).toFixed(1)
            ),
          }
        })

      // ── Network ──────────────────────────────────────────────────────────
      const iface =
        (netStats || []).find(
          (n) => n.operstate === 'up' && (n.rx_sec != null || n.tx_sec != null)
        ) ||
        (netStats || []).find((n) => n.operstate === 'up') ||
        (netStats || [])[0] ||
        {}

      const rxSec = iface.rx_sec
      const txSec = iface.tx_sec

      const fmtRate = (bytesPerSec) => {
        if (bytesPerSec == null) return 'Measuring...'
        const bps = bytesPerSec < 0 ? 0 : bytesPerSec
        if (bps === 0) return '0 KB/s'
        if (bps < 1024) return `${bps.toFixed(0)} B/s`
        if (bps < 1048576) return `${(bps / 1024).toFixed(1)} KB/s`
        return `${(bps / 1048576).toFixed(2)} MB/s`
      }

      const network = {
        interface: iface.iface || 'Network',
        status: iface.operstate === 'up' ? 'ONLINE' : 'ACTIVE',
        downloadSpeed: fmtRate(rxSec),
        uploadSpeed: fmtRate(txSec),
        totalReceived: `${((iface.rx_bytes || 0) / 1048576).toFixed(1)} MB`,
        totalSent: `${((iface.tx_bytes || 0) / 1048576).toFixed(1)} MB`,
        downloadRate: rxSec ?? 0,
        uploadRate: txSec ?? 0,
      }

      // ── GPUs ─────────────────────────────────────────────────────────────
      const nvidiaByName = new Map()
      if (nvidiaGpus) {
        for (const g of nvidiaGpus) {
          nvidiaByName.set(g.name.toLowerCase(), g)
          const words = g.name.toLowerCase().split(' ')
          for (let i = 1; i < words.length; i++) {
            nvidiaByName.set(words.slice(i).join(' '), g)
          }
        }
      }

      const nowTimestamp = Date.now()

      const gpus = (this.staticHardware?.gpuControllers || []).map((ctrl, idx) => {
        const modelLower = (ctrl.model || '').toLowerCase()
        const vendorLower = (ctrl.vendor || '').toLowerCase()

        const isNvidia =
          vendorLower.includes('nvidia') ||
          modelLower.includes('nvidia') ||
          modelLower.includes('geforce') ||
          modelLower.includes('rtx') ||
          modelLower.includes('gtx')

        const isIntel =
          vendorLower.includes('intel') ||
          modelLower.includes('intel') ||
          modelLower.includes('uhd') ||
          modelLower.includes('iris')

        // 1. Fetch Windows Performance Counter telemetry for this GPU
        const winGpu = windowsGpuMonitor.getGpuMetrics(
          ctrl.model,
          ctrl.vendor,
          isNvidia,
          isIntel
        )

        // 2. Fetch nvidia-smi telemetry if NVIDIA
        let smiData = null
        if (isNvidia && nvidiaGpus) {
          for (const [key, val] of nvidiaByName) {
            if (modelLower.includes(key) || key.includes(modelLower.split(' ').pop())) {
              smiData = val
              break
            }
          }
          if (!smiData) smiData = nvidiaGpus[0]
        }

        // 3. Resolve Engine Utilization metrics
        // 3D Engine: Prefer Windows GPU engine counter, fallback to nvidia-smi
        let threeDVal = null
        if (winGpu?.threeD != null) {
          threeDVal = winGpu.threeD
        } else if (smiData?.utilizationGpu != null) {
          threeDVal = smiData.utilizationGpu
        }

        // Copy / Encoder Engine
        let copyVal = null
        if (winGpu?.copy != null) {
          copyVal = winGpu.copy
        } else if (smiData?.encoderUtil != null) {
          copyVal = smiData.encoderUtil
        }

        // Video Decode Engine
        let videoDecodeVal = null
        if (winGpu?.videoDecode != null) {
          videoDecodeVal = winGpu.videoDecode
        } else if (smiData?.decoderUtil != null) {
          videoDecodeVal = smiData.decoderUtil
        }

        // Video Processing Engine
        let videoProcVal = winGpu?.videoProcessing != null ? winGpu.videoProcessing : null

        // 4. Resolve Memory metrics
        let dedicatedUsedMB = null
        let dedicatedTotalMB = null
        let sharedUsedMB = null
        let sharedTotalMB = Math.round(memTotalGB * 0.5 * 1024) // 50% system RAM is standard Windows shared limit

        if (isNvidia) {
          if (smiData?.memTotalMB > 0) {
            dedicatedTotalMB = smiData.memTotalMB
            dedicatedUsedMB = smiData.memUsedMB
          } else if (winGpu?.dedicatedMB != null) {
            dedicatedTotalMB = (ctrl.vram || 4096)
            dedicatedUsedMB = winGpu.dedicatedMB
          }
          if (winGpu?.sharedMB != null) {
            sharedUsedMB = winGpu.sharedMB
          }
        } else if (isIntel) {
          const staticDedicated = ctrl.vram || 128
          dedicatedTotalMB = staticDedicated
          dedicatedUsedMB = winGpu?.dedicatedMB != null ? Math.min(staticDedicated, winGpu.dedicatedMB) : staticDedicated
          if (winGpu?.sharedMB != null) {
            sharedUsedMB = winGpu.sharedMB
          }
        } else {
          dedicatedTotalMB = ctrl.vram || 1024
          dedicatedUsedMB = winGpu?.dedicatedMB ?? null
          sharedUsedMB = winGpu?.sharedMB ?? null
        }

        // 5. Thermal, Clocks, Power, Driver
        let temperatureC = smiData?.temperature ?? null
        let driverVersion = smiData?.driverVersion ?? (ctrl.driverVersion || 'N/A')
        let powerDrawW = smiData?.powerDrawW ?? null
        let clockCoreMHz = smiData?.clockCoreMHz ?? null
        let clockMemMHz = smiData?.clockMemMHz ?? null

        // 6. Manage rolling history buffers in memory (60 seconds / samples)
        const gpuKey = `GPU ${idx}`
        if (!this.gpuHistories.has(gpuKey)) {
          this.gpuHistories.set(gpuKey, {
            threeD: [],
            copy: [],
            videoDecode: [],
            videoProcessing: [],
            dedicatedMem: [],
            sharedMem: [],
            power: [],
            temp: [],
            coreClk: [],
          })
        }
        const hist = this.gpuHistories.get(gpuKey)

        const pushHist = (arr, val) => {
          if (val != null && !isNaN(val)) {
            arr.push({ timestamp: nowTimestamp, value: Number(val) })
          }
          if (arr.length > MAX_HISTORY_SAMPLES) {
            arr.shift()
          }
        }

        pushHist(hist.threeD, threeDVal)
        pushHist(hist.copy, copyVal)
        pushHist(hist.videoDecode, videoDecodeVal)
        pushHist(hist.videoProcessing, videoProcVal)
        pushHist(hist.dedicatedMem, dedicatedUsedMB)
        pushHist(hist.sharedMem, sharedUsedMB)
        pushHist(hist.power, powerDrawW)
        pushHist(hist.temp, temperatureC)
        pushHist(hist.coreClk, clockCoreMHz)

        // 7. Human-readable presentation fields
        const utilization = threeDVal != null ? `${Math.round(threeDVal)}%` : 'N/A'
        let memoryTotal = 'N/A'
        let memoryUsed = 'N/A'
        let memoryUtilization = 'N/A'

        if (isNvidia && dedicatedTotalMB > 0) {
          memoryTotal = `${(dedicatedTotalMB / 1024).toFixed(1)} GB`
          memoryUsed = dedicatedUsedMB != null ? `${(dedicatedUsedMB / 1024).toFixed(1)} GB` : 'N/A'
          memoryUtilization = dedicatedUsedMB != null ? `${((dedicatedUsedMB / dedicatedTotalMB) * 100).toFixed(1)}%` : 'N/A'
        } else if (isIntel) {
          if (sharedUsedMB != null) {
            memoryUsed = `${(sharedUsedMB / 1024).toFixed(2)} GB`
            memoryTotal = `${(sharedTotalMB / 1024).toFixed(1)} GB Shared`
            memoryUtilization = `${((sharedUsedMB / sharedTotalMB) * 100).toFixed(1)}%`
          } else {
            memoryTotal = `${(sharedTotalMB / 1024).toFixed(1)} GB (Shared)`
            memoryUsed = 'Shared'
          }
        }

        const temperature = temperatureC != null ? `${temperatureC}°C` : isIntel ? 'N/A (iGPU)' : 'N/A'
        const powerDraw = powerDrawW != null ? `${powerDrawW.toFixed(1)} W` : 'N/A'
        const clockCore = clockCoreMHz != null ? `${clockCoreMHz} MHz` : 'N/A'
        const clockMemory = clockMemMHz != null ? `${clockMemMHz} MHz` : 'N/A'

        // 8. Return structured telemetry object matching data contract
        return {
          id: `GPU ${idx}`,
          name: ctrl.model || `Display Adapter ${idx}`,
          vendor: ctrl.vendor || (isNvidia ? 'NVIDIA' : isIntel ? 'Intel' : 'Unknown'),
          type: isNvidia
            ? 'DISCRETE ACCELERATOR'
            : isIntel
            ? 'INTEGRATED GRAPHICS'
            : 'GRAPHICS ADAPTER',

          // Human-readable summary strings
          utilization,
          temperature,
          memoryTotal,
          memoryUsed,
          memoryUtilization,
          driverVersion,
          powerDraw,
          clockCore,
          clockMemory,

          // Legacy flat numeric props for backward compatibility
          utilizationRaw: threeDVal,
          encoderUtil: copyVal,
          decoderUtil: videoDecodeVal,
          videoProcessingUtil: videoProcVal,
          memUsedMB: dedicatedUsedMB,
          memTotalMB: dedicatedTotalMB,
          memUtilRaw:
            dedicatedTotalMB > 0 && dedicatedUsedMB != null
              ? parseFloat(((dedicatedUsedMB / dedicatedTotalMB) * 100).toFixed(1))
              : null,
          sharedMemoryUsedMB: sharedUsedMB,
          sharedMemoryTotalMB: sharedTotalMB,
          powerDrawW,
          temperatureC,
          clockCoreMHz,
          clockMemMHz,

          // New Engine hierarchy with 60-sample historical series
          engines: {
            threeD: {
              available: threeDVal != null,
              current: threeDVal,
              history: hist.threeD,
            },
            copy: {
              available: copyVal != null,
              current: copyVal,
              history: hist.copy,
            },
            videoDecode: {
              available: videoDecodeVal != null,
              current: videoDecodeVal,
              history: hist.videoDecode,
            },
            videoProcessing: {
              available: videoProcVal != null,
              current: videoProcVal,
              history: hist.videoProcessing,
            },
          },

          // Memory hierarchy with dedicated and shared series
          memory: {
            dedicated: {
              available: dedicatedUsedMB != null,
              used: dedicatedUsedMB,
              total: dedicatedTotalMB,
              history: hist.dedicatedMem,
            },
            shared: {
              available: sharedUsedMB != null,
              used: sharedUsedMB,
              total: sharedTotalMB,
              history: hist.sharedMem,
            },
          },

          // Thermal & Clock series
          diagnostics: {
            power: {
              available: powerDrawW != null,
              current: powerDrawW,
              history: hist.power,
            },
            temperature: {
              available: temperatureC != null,
              current: temperatureC,
              history: hist.temp,
            },
            coreClock: {
              available: clockCoreMHz != null,
              current: clockCoreMHz,
              history: hist.coreClk,
            },
          },
        }
      })

      // ── Assemble frame ────────────────────────────────────────────────────
      this.cachedTelemetry = {
        timestamp: new Date().toISOString(),
        host: process.env.COMPUTERNAME || process.env.HOSTNAME || 'SENTINELX-NODE',
        cpu,
        memory,
        disks,
        network,
        gpus,
      }

      this.lastSampleTime = Date.now()
      this._notifySubscribers(this.cachedTelemetry)

      return this.cachedTelemetry
    } catch (err) {
      console.error('[Telemetry] collectFrame error:', err.message)
      return this.cachedTelemetry
    }
  }

  // ── 5. Interval management ────────────────────────────────────────────────

  _startInterval() {
    if (this.isSampling) return
    this.isSampling = true
    this.intervalId = setInterval(() => this.collectFrame(), 1000)
    console.log('[Telemetry] Background sampler started (1 s interval)')
  }

  stopSampler() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isSampling = false
  }

  // ── 6. SSE subscriber management ─────────────────────────────────────────

  subscribe(res) {
    this.subscribers.add(res)
    console.log(`[Telemetry] SSE client connected (${this.subscribers.size} total)`)

    if (this.cachedTelemetry) {
      res.write(`data: ${JSON.stringify(this.cachedTelemetry)}\n\n`)
    }

    res.on('close', () => {
      this.subscribers.delete(res)
      console.log(`[Telemetry] SSE client disconnected (${this.subscribers.size} remaining)`)
    })
  }

  _notifySubscribers(data) {
    if (!this.subscribers.size || !data) return
    const payload = `data: ${JSON.stringify(data)}\n\n`
    for (const res of this.subscribers) {
      try {
        res.write(payload)
      } catch {
        this.subscribers.delete(res)
      }
    }
  }

  // ── 7. REST snapshot ──────────────────────────────────────────────────────

  async getTelemetry() {
    if (this.cachedTelemetry && Date.now() - this.lastSampleTime < 1500) {
      return this.cachedTelemetry
    }
    return this.collectFrame()
  }
}

// Singleton — one sampler loop per process, shared across all route handlers
export const systemMonitorService = new SystemMonitorService()
export default systemMonitorService
