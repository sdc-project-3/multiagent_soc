import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class WindowsGpuMonitor {
  constructor() {
    this.isWindows = process.platform === 'win32'
    this.childProcess = null
    this.latestData = null
    this.lastUpdateTime = 0
    this.isRunning = false
    this.restartTimeout = null
    this.buffer = ''

    if (this.isWindows) {
      this.start()
    }
  }

  start() {
    if (!this.isWindows || this.isRunning) return
    this.isRunning = true

    const scriptPath = path.resolve(__dirname, 'gpuSampler.ps1')

    try {
      this.childProcess = spawn(
        'powershell.exe',
        ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', scriptPath],
        {
          windowsHide: true,
          stdio: ['ignore', 'pipe', 'pipe'],
        }
      )

      this.childProcess.stdout.setEncoding('utf8')
      this.childProcess.stdout.on('data', (chunk) => {
        this.buffer += chunk
        const lines = this.buffer.split(/\r?\n/)
        // Keep remainder
        this.buffer = lines.pop()

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('{')) continue
          try {
            const parsed = JSON.parse(trimmed)
            if (parsed && Array.isArray(parsed.adapters)) {
              this.latestData = parsed
              this.lastUpdateTime = Date.now()
            }
          } catch {
            // Non-json output or partial frame
          }
        }
      })

      this.childProcess.stderr.on('data', (errChunk) => {
        const errStr = errChunk.toString().trim()
        if (errStr) {
          console.warn('[WindowsGpuMonitor stderr]:', errStr)
        }
      })

      this.childProcess.on('error', (err) => {
        console.warn('[WindowsGpuMonitor spawn error]:', err.message)
        this._scheduleRestart()
      })

      this.childProcess.on('exit', (code, signal) => {
        console.warn(`[WindowsGpuMonitor] Process exited (code: ${code}, signal: ${signal})`)
        this._scheduleRestart()
      })
    } catch (err) {
      console.warn('[WindowsGpuMonitor] Failed to start:', err.message)
      this._scheduleRestart()
    }
  }

  _scheduleRestart() {
    this.isRunning = false
    this.childProcess = null
    if (this.restartTimeout) clearTimeout(this.restartTimeout)
    this.restartTimeout = setTimeout(() => {
      if (this.isWindows) {
        this.start()
      }
    }, 3000)
  }

  stop() {
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout)
      this.restartTimeout = null
    }
    if (this.childProcess) {
      try {
        this.childProcess.kill()
      } catch {}
      this.childProcess = null
    }
    this.isRunning = false
  }

  /**
   * Find matching Windows GPU performance counter adapter data.
   */
  getGpuMetrics(modelName = '', vendorName = '', isNvidia = false, isIntel = false) {
    if (!this.latestData || !Array.isArray(this.latestData.adapters)) {
      return null
    }

    const modelClean = modelName.toLowerCase()
    const vendorClean = vendorName.toLowerCase()

    // 1. Try exact or partial name matching
    for (const adapter of this.latestData.adapters) {
      const adapterNameClean = (adapter.name || '').toLowerCase()
      if (
        (modelClean && adapterNameClean.includes(modelClean)) ||
        (adapterNameClean && modelClean.includes(adapterNameClean))
      ) {
        return adapter
      }
    }

    // 2. Try vendor matching
    for (const adapter of this.latestData.adapters) {
      const adapterNameClean = (adapter.name || '').toLowerCase()
      const vId = adapter.vendorId

      if (isNvidia) {
        if (vId === 0x10de || adapterNameClean.includes('nvidia') || adapterNameClean.includes('geforce') || adapterNameClean.includes('rtx')) {
          return adapter
        }
      }

      if (isIntel) {
        if (vId === 0x8086 || adapterNameClean.includes('intel') || adapterNameClean.includes('uhd') || adapterNameClean.includes('iris')) {
          return adapter
        }
      }
    }

    // 3. Fallback to index if 2 GPUs match 2 adapters
    if (this.latestData.adapters.length > 0) {
      if (isIntel && this.latestData.adapters[0]) return this.latestData.adapters[0]
      if (isNvidia && this.latestData.adapters[1]) return this.latestData.adapters[1]
    }

    return null
  }
}

export const windowsGpuMonitor = new WindowsGpuMonitor()
export default windowsGpuMonitor
