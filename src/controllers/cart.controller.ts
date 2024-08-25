import { ParamsDictionary } from 'express-serve-static-core'
import { Ok } from '~/core/success.response'
import { CartCreateRequestBody, UpdateCartRequestBody } from './../types/cart.type'
import CartService from '~/services/cart.service'
import { Request, Response } from 'express'
import { ITokenPayload } from '~/types/TokenPayload'
class CartController {
  static async createCart(req: Request<ParamsDictionary, any, CartCreateRequestBody>, res: Response) {
    new Ok({ message: 'created cart', metadata: await CartService.create(req.body) }).send(res)
  }

  static async addToCart(req: Request<ParamsDictionary, any, UpdateCartRequestBody>, res: Response) {
    const { userId } = req.decodeAccessToken as ITokenPayload
    new Ok({ message: 'add to cart', metadata: await CartService.addToCart(req.body, userId) })
  }
}

export default CartController
