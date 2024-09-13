import { ParamsDictionary } from 'express-serve-static-core'
import { Created, Ok } from '~/core/success.response'
import { createSpu, getOneSpu } from '~/services/spu.service'
import { Request, Response } from 'express'
import { ITokenPayload } from '~/types/TokenPayload'
class SpuController {
  static async createSpu(
    req: Request<
      ParamsDictionary,
      any,
      {
        spu_name: string
        spu_thumb: string
        spu_description: string
        spu_price: number
        spu_category: string[]
        spu_quantity: number
        spu_attributes: Object
        spu_variations: Object[]
        sku_list: Object[]
      }
    >,
    res: Response
  ) {
    const { userId } = req.decodeAccessToken as ITokenPayload
    const { sku_list, ...payloadSpu } = req.body
    new Created({
      message: 'created product',
      metadata: await createSpu({ ...payloadSpu, spu_shop: userId }, sku_list)
    }).send(res)
  }

  static async getOne(req: Request<ParamsDictionary, any, any, { [key: string]: string }>, res: Response) {
    const product_id = req.query.product_id

    new Ok({ message: 'Get one Product', metadata: await getOneSpu(product_id) }).send(res)
  }
}

export default SpuController
