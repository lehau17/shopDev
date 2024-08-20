import { Request, Response, NextFunction } from 'express'
import { Created, Ok } from '~/core/success.response'
import { KeyToken } from '~/models/keyToken.model'
import AccessService from '~/services/access.service'

class AccessController {
  signUp = async (req: Request, res: Response) => {
    const result = await AccessService.signUp(req.body)
    new Created({ metadata: result }).send(res)
  }
  login = async (req: Request, res: Response) => {
    new Ok({ metadata: await AccessService.login(req.body) }).send(res)
  }
  logout = async (req: Request, res: Response) => {
    new Ok({ metadata: await AccessService.logout(req.keyStore as KeyToken) }).send(res)
  }
  refreshToken = async (req: Request, res: Response) => {
    new Ok({ metadata: await AccessService.refreshToken(req.body.refreshToken) }).send(res)
  }
}

export default new AccessController()
