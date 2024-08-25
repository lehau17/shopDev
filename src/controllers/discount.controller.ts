import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { Ok } from '~/core/success.response'
import DiscountService from '~/services/discount.service'
import { CreateDiscountRequestBody, RemoveDiscountRequestBody } from '~/types/discount.type'
import { ITokenPayload } from '~/types/TokenPayload'

class DiscountController {
  static async create(req: Request<ParamsDictionary, any, CreateDiscountRequestBody>, res: Response) {
    const { userId } = req.decodeAccessToken as ITokenPayload
    return new Ok({ message: 'Created discount', metadata: await DiscountService.createDiscount(req.body, userId) }).send(res)
  }
  static async removeDiscountWithCodeAndShopId(req: Request<ParamsDictionary, any, RemoveDiscountRequestBody>, res: Response) {
    const { userId } = req.decodeAccessToken as ITokenPayload
    const { code } = req.body
    return new Ok({
      message: 'Removed discount',
      metadata: await DiscountService.removeDiscountByCodeAndShopId({ code, shop_id: userId })
    }).send(res)
  }
  static async getAllDiscountsCodeWithProducts(req: Request, res: Response) {
    const code = req.params.code
    const { userId } = req.decodeAccessToken as ITokenPayload
    return new Ok({
      message: 'get product by discount',
      metadata: await DiscountService.getAllDiscountsCodeWithProducts({ code, shopId: userId })
    }).send(res)
  }
}

export default DiscountController
