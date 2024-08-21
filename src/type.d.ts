import express from 'express'
import { IApiKey } from './models/apiKey.model'
import { KeyToken } from './models/keyToken.model'
import { ITokenPayload } from './types/TokenPayload'

declare global {
  namespace Express {
    interface Request {
      apiKey?: IApiKey
      keyStore?: KeyToken
      decodeRefreshToken?: ITokenPayload
      decodeAccessToken?: ITokenPayload
      refreshToken?: string
      user_id?: string
    }

    interface User extends IUser {}
  }
}
