import { NextFunction, RequestHandler, Request, Response } from 'express'

export const asyncHandler = (fn: (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Chay api >>>>>>>>>')
      await fn(req, res, next)
    } catch (error) {
      console.log('vao catch')
      next(error)
    }
  }
}
