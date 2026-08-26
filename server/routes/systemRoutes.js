import { Router } from 'express'
import systemMonitorService from '../services/systemMonitorService.js'

const router = Router()

// ---------------------------------------------------------------------------
// GET /api/system/telemetry
// One-shot REST snapshot of the current hardware telemetry frame.
// The cors() middleware in server.js already sets the correct CORS headers —
// do NOT set Access-Control-Allow-Origin here (would conflict with
// credentials:true and cause browser rejections).
// ---------------------------------------------------------------------------
router.get('/telemetry', async (req, res) => {
  try {
    const data = await systemMonitorService.getTelemetry()
    return res.status(200).json({ success: true, data })
  } catch (err) {
    console.error('[Telemetry] REST endpoint error:', err.message)
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve hardware telemetry',
      error:   err.message,
    })
  }
})

// ---------------------------------------------------------------------------
// GET /api/system/telemetry/stream
// Server-Sent Events stream — pushes a telemetry frame every ~1 s.
//
// IMPORTANT: Do NOT set Access-Control-Allow-Origin manually here.
// The global cors() middleware in server.js handles it correctly.
// Setting '*' here would conflict with credentials:true and the browser
// would refuse the SSE connection with a CORS error.
// ---------------------------------------------------------------------------
router.get('/telemetry/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type':  'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection':    'keep-alive',
    'X-Accel-Buffering': 'no',   // disable Nginx buffering if proxied
  })

  // Flush headers immediately so the browser's EventSource fires onopen
  res.flushHeaders?.()

  // Initial comment keeps the connection alive and signals readiness
  res.write(': connected\n\n')

  console.log('[Telemetry] SSE stream opened')
  systemMonitorService.subscribe(res)
})

export default router
