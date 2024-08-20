import express from 'express'
import { IApiKey } from './models/apiKey.model'
import { KeyToken } from './models/keyToken.model'

declare global {
  namespace Express {
    interface Request {
      apiKey?: IApiKey
      keyStore?: KeyToken
    }

    interface User extends IUser {}
  }
}
