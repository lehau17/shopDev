import { Request, Response, NextFunction, RequestHandler } from 'express'
import { AuthenticationFailureResponse, NotFoundResponse } from '~/core/error.response'
import { asyncHandler } from '~/helpers/asyncHandler'
import { IApiKey } from '~/models/apiKey.model'
import { apiKeyFindByKeyService } from '~/services/apiKey.service'
import KeyTokenService from '~/services/keyToken.service'
import { verifyToken } from './authUtils'

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
  CLIENT_ID: 'x-client-id'
}

export const apiKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString()
    if (!key) {
      return res.status(403).json({
        message: 'FORBIDDEN'
      })
    }
    const apiKey = await apiKeyFindByKeyService(key)
    if (!apiKey) {
      return res.status(403).json({
        message: 'FORBIDDEN'
      })
    }
    req.apiKey = apiKey
    next()
  } catch (error) {
    console.log(error)
  }
}

export const permissionApiKey = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.apiKey as IApiKey
    if (!apiKey.permissions) {
      return res.status(403).json({
        message: 'Permission denied'
      })
    }
    if (!apiKey.permissions.includes(permission)) {
      return res.status(403).json({
        message: 'Permission denied'
      })
    }
    next()
  }
}

/**
 * 1 check headers client_Id
 * 2 get access token
 * 3 verify access token
 * check user in dbs
 * check keyStore
 */
export const authentication = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.headers[HEADER.CLIENT_ID] as string
  if (!user_id) {
    throw new AuthenticationFailureResponse({ message: 'Invalid request' })
  }
  const accessToken = req.headers[HEADER.AUTHORIZATION] as string
  if (!accessToken) {
    throw new AuthenticationFailureResponse({ message: 'Invalid request' })
  }
  const keyToken = await KeyTokenService.findByUserId(user_id)
  if (!keyToken) {
    throw new NotFoundResponse({ message: 'Not found keyStore' })
  }
  try {
    const decodeToken = await verifyToken(accessToken, keyToken.privateKey)
    if (decodeToken.userId !== user_id) {
      throw new AuthenticationFailureResponse({ message: 'Invalid userId' })
    }
    req.keyStore = keyToken
    next()
  } catch (err) {
    console.log('check error: ' + err)
    throw err
  }
})
