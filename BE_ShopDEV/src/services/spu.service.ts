import { BadRequestResponse, NotFoundResponse } from '~/core/error.response'
import { findShopByIdService } from './shop.service'
import { removeFieldNull } from '~/utils/convertData'
import SpuModel from '~/models/spu.model'
import { createSkus } from './sku.service'
import { randomId } from '~/utils'

export const createSpu = async (
  body: {
    spu_name: string
    spu_thumb: string
    spu_description: string
    spu_price: number
    spu_category: string[]
    spu_quantity: number
    spu_shop: string
    spu_attributes: Object
    spu_variations: Object[]
  },
  sku_list?: Object[]
) => {
  //1. check shop is Exist
  const foundShop = await findShopByIdService(body.spu_shop)
  if (!foundShop)
    throw new NotFoundResponse({
      message: 'Shop not found'
    })
  // 2. remove fields null of undified
  // const newBody = removeFieldNull(body)
  // 3. create spu
  const spu = await SpuModel.create({ ...body, spu_id: randomId() })
  if (spu && sku_list && sku_list.length > 0) {
    // create Skus
    console.log('Check?>>>>>>>>>>>> creating Skus')
    await createSkus({ spu_id: spu.spu_id, list: sku_list })
    console.log('check>>Successfully created')
  }
  return spu
}

export const getOneSpu = async (product_id: string) => {
  const foundSpu = await SpuModel.findOne({ spu_id: product_id }).lean()
  if (!foundSpu)
    throw new NotFoundResponse({
      message: 'Not found Product'
    })
  return foundSpu
}
