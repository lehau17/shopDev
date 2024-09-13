import { createClient } from 'redis'
import { promisify } from 'util'
import { reservationInventory } from '~/models/repositories/inventory.repository'
import { getRedis } from '~/configs/redis.config'
const { instanceRedis: redisClient } = getRedis()

const pexprire = promisify(redisClient.pExpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)

export const acquireLock = async (productId: string, quantity: number, cardId: string) => {
  const key = `lock_v2023_${productId}`
  const retryTimes = 10
  const expireTime = 3000
  for (let i = 0; i < retryTimes; i++) {
    const result = await setnxAsync(key, expireTime)
    if (result === 1) {
      // tt vs inventory
      const isInventory = await reservationInventory({ productId, quantity, cartId: cardId })
      if (isInventory.modifiedCount > 0) {
        await pexprire(key, expireTime)
        return key
      }
      return null
    } else {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    }
  }
}

export const releaseLock = async (key: string) => {
  const delAsyncKey = promisify(redisClient.del).bind(this)
  return await delAsyncKey(key)
}
