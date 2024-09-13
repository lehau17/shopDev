import rbac from '~/configs/rbac.config'
import { AuthenticationFailureResponse } from '~/core/error.response'
import { Request, Response, NextFunction } from 'express'
export const accessControll = (action: 'create' | 'createOwn', resource: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const role = req.query.role as string
    const accessControll = await rbac()
    const permisstion = accessControll.can(role)[action](resource)
    if (!permisstion.granted) throw new AuthenticationFailureResponse({ message: 'Access denied' })
  }
}
