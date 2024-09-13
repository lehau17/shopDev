import { RedisClientType, createClient } from 'redis'
import { RedisErrorResponse } from '~/core/error.response'

const client: { [key: string]: RedisClientType } = {},
  STATUS_REDIS = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error'
  },
  TIMEOUT_CONNECT = 5000
let connectionTimeout: NodeJS.Timeout

const handleTimeout = () => {
  connectionTimeout = setTimeout(() => {
    throw new RedisErrorResponse({
      message: 'Redis connection timeout'
    })
  }, TIMEOUT_CONNECT)
}

const handleListener = ({ instance }: { instance: RedisClientType }) => {
  instance.on(STATUS_REDIS.CONNECT, () => {
    console.log('Redis Connected')
    clearTimeout(connectionTimeout)
    return
  })
  instance.on(STATUS_REDIS.END, () => {
    console.log('Redis disconnected')
    clearTimeout(connectionTimeout)
  })
  instance.on(STATUS_REDIS.RECONNECT, () => {
    console.log('Redis reconnecting')
    handleTimeout()
  })
  instance.on(STATUS_REDIS.ERROR, (error) => {
    console.log('Redis error:>>', error)
    handleTimeout()
  })
}

export const initRedis = () => {
  const instanceRedis = createClient({
    url: 'redis://localhost:6379' // Thay đổi theo cấu hình Redis của bạn
  })

  // instanceRedis.on('ready', () => {
  //   console.log('Redis is ready')
  // })

  // instanceRedis.on('error', (err) => {
  //   console.log('Redis connection error:', err)
  // })

  client.instanceRedis = instanceRedis as any

  //handleListener
  handleListener({ instance: instanceRedis as any })

  // Kết nối Redis
  instanceRedis.connect().catch((err) => {
    console.error('Redis connection failed:', err)
  })
}

export const getRedis = () => {
  return client
}

export const closeRedis = async () => {
  if (client.instanceRedis) {
    await client.instanceRedis.disconnect()
    console.log('Redis connection closed')
  }
}
