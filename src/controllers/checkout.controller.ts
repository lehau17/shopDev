import { Request, Response } from 'express'
import { Ok } from '~/core/success.response'
import CheckoutService from '~/services/checkout.service'
import { ITokenPayload } from '~/types/TokenPayload'

class CheckoutController {
  static async reviewOrder(req: Request, res: Response) {
    const { userId } = req.decodeAccessToken as ITokenPayload
    const { cardId, shop_order_ids } = req.body
    new Ok({ message: 'Review Order', metadata: await CheckoutService.checkoutReview({ userId, cardId, shop_order_ids }) }).send(res)
  }
}

export default CheckoutController
