import mongoose from 'mongoose'
import os from 'os'
import process from 'process'
const _CHECK_PER_SECOND = 5000
export const checkNumberConnect = () => {
  const numConnection = mongoose.connections.length
  console.log(`Checking ${numConnection} connections`)
  return numConnection
}

export const checkOverLoad = () => {
  setInterval(() => {
    const numberConnection = checkNumberConnect()
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss
    // Example maximum connect per core is 5
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024}MB`)
    const maxConnections = numCores * 5
    if (numberConnection > maxConnections) {
      console.log('Connection overload: ')
    }
  }, _CHECK_PER_SECOND)
}
