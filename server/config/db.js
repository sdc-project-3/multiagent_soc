import mongoose from 'mongoose'

/**
 * Connect to Local MongoDB instance using Mongoose
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sentinelx'

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    })

    const host = conn.connection.host || 'localhost'
    const port = conn.connection.port || 27017
    const dbName = conn.connection.name || 'sentinelx'

    console.log(`[SENTINELX] MongoDB connected successfully`)
    console.log(`Database: ${dbName}`)
    console.log(`Host: ${host}:${port}`)

    return conn
  } catch (error) {
    console.error(`\n[SENTINELX] MongoDB connection failed.`)
    console.error(`Make sure the local MongoDB server is running on:`)
    console.error(`mongodb://localhost:27017`)
    console.error(`Error details: ${error.message}\n`)
    return null
  }
}

export default connectDB
