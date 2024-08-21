import mongoose from 'mongoose'
import { Request, Response, NextFunction } from 'express'
import { BadRequestResponse } from '~/core/error.response'

export function checkObjectParams(req: Request, res: Response, next: NextFunction) {
  console.log(req.params)
  const id = req.params.id
  console.log('checkId>>>', id)
  // assuming the ObjectId is in req.params with key 'id'
  // console.log('checkIDS>>>>', ids.toString())
  // const keys = Object.keys(ids)

  // keys.forEach((key) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestResponse({ message: 'ObjectId invalid request' })
  }
  // })

  next()
}
