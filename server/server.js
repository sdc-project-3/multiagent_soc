import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables immediately
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config()

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import systemRoutes from './routes/systemRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

// 1. Establish MongoDB Connection
connectDB()

// 2. Security & Request Parsing Middleware
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// 3. API Routes
app.use('/api/auth', authRoutes)
app.use('/api/system', systemRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'SentinelX Security Authentication Service',
    timestamp: new Date().toISOString(),
    database: 'MongoDB Connected',
  })
})

// 4. Serve Vite production build static files (production only)
// In development, Vite's own dev server handles static serving.
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../dist')
  app.use(express.static(distPath))

  // SPA catch-all: any route not matched by /api/* falls through to index.html
  // so React Router can handle /auth/login, /dashboard, etc. client-side.
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

// 5. Global 404 Handler for API (only reached in development, production uses SPA catch-all)
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.originalUrl} not found on SentinelX server.`,
  })
})

// 6. Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack || err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal SentinelX security platform error.',
  })
})

// 7. Start HTTP Server
app.listen(PORT, () => {
  console.log(`====================================================`)
  console.log(`  SENTINELX SECURITY BACKEND ONLINE                 `)
  console.log(`  API Listening on: http://localhost:${PORT}        `)
  console.log(`  Client Allowed:   ${CLIENT_URL}                   `)
  console.log(`====================================================`)
})

export default app
