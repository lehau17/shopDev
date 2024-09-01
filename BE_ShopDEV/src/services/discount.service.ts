import { deleteModel, FlattenMaps, Schema } from 'mongoose'
import { BadRequestResponse, ConfigResponse, NotFoundResponse } from '~/core/error.response'
import DiscountModel from '~/models/discount.model'
import { IProduct } from '~/models/Product.model'
import { findDiscountByCodeAndShop } from '~/models/repositories/discount.repository'
import { findAllProducts, findProductIsPublished } from '~/models/repositories/product.repository'
import { CreateDiscountRequestBody } from '~/types/discount.type'
import { ProductTotalAmountRequest } from '~/types/product.type'
import { convertStringToObjectId } from '~/utils/convertData'
import { DiscountApplyTo, DiscountType } from '~/utils/enums'

class DiscountService {
  static async createDiscount(body: CreateDiscountRequestBody, shop_id: string) {
    const { discount_start_date, discount_end_date, discount_code } = body
    // check date
    if (new Date(discount_end_date) < new Date(discount_start_date)) {
      throw new BadRequestResponse({ message: 'End date must be before start date' })
    }
    if (new Date(discount_start_date) < new Date()) {
      throw new BadRequestResponse({ message: 'Start date must be before today' })
    }
    if (new Date(discount_end_date) < new Date()) {
      throw new BadRequestResponse({ message: 'End date must be before today' })
    }
    //check exist code in dbs
    const foundDiscount = await findDiscountByCodeAndShop({ code: discount_code, shopId: shop_id })
    if (foundDiscount) {
      throw new ConfigResponse({ message: 'Discount with code ' + foundDiscount.discount_code + 'already exists' })
    }
    //create new discount
    const newDiscount = await DiscountModel.create({
      ...body,
      discount_start_date: new Date(discount_start_date),
      discount_end_date: new Date(discount_end_date),
      discount_shopId: convertStringToObjectId(shop_id)
    })

    return newDiscount
  }

  static async removeDiscountByCodeAndShopId({ code, shop_id }: { code: string; shop_id: string }) {
    const deleted = await DiscountModel.findOneAndDelete({ discount_code: code, discount_shop_id: shop_id }).lean()
    if (deleted) {
      return deleted
    }
    throw new NotFoundResponse({ message: 'discount not found' })
  }
  // Cancel hay la xoa nguoi dung khi ho khong su dung nua
  static async cancelDiscountCode({ code, shop_id, user_id }: { code: string; shop_id: string; user_id: string }) {
    const updated = await DiscountModel.findOneAndUpdate(
      { discount_code: code, discount_shop_id: convertStringToObjectId(shop_id) },
      { $pull: { discount_user_used: user_id } }
    ).lean()
    return updated
  }

  static async getAllDiscountsCodeWithProducts({
    code,
    shopId,
    limit = 60,
    page = 1
  }: {
    code: string
    shopId: string
    limit?: number
    page?: number
  }) {
    const foundDiscount = await findDiscountByCodeAndShop({ code, shopId })
    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundResponse({ message: 'Discount not found' })
    }
    const { discount_applies_to, discount_products_id } = foundDiscount
    let products: FlattenMaps<IProduct>[] = []
    if (discount_applies_to === DiscountApplyTo.ALL) {
      products = await findProductIsPublished({
        limit,
        page,
        filter: {
          product_shop: shopId
        }
      })
    }
    if (discount_applies_to === DiscountApplyTo.SPECIFIC) {
      products = await findProductIsPublished({
        limit,
        page,
        filter: {
          _id: { $in: discount_products_id }
        }
      })
    }
    return { products, limit, page }
  }

  static async getDiscountAmount({
    code,
    userId,
    shopId,
    products
  }: {
    code: string
    userId: string
    shopId: string
    products: ProductTotalAmountRequest[]
  }) {
    const foundDiscount = await DiscountModel.findOne({
      discount_code: code,
      discount_shopId: convertStringToObjectId(shopId),
      discount_is_active: true
    })
    if (!foundDiscount) {
      throw new NotFoundResponse({ message: 'Discount not found' })
    }
    if (foundDiscount.discount_end_date < new Date()) throw new BadRequestResponse({ message: 'Discount expired date' })
    let totalOrder = 0

    //check discount_Min tránh hacker sửa layload
    if (foundDiscount.discount_min_order_value > 0) {
      //totalOrder =
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price
      }, 0)
      //check totalOrder vs min_value_order
      if (totalOrder < foundDiscount.discount_min_order_value) {
        throw new BadRequestResponse({ message: 'discount required total order larger than min_value_order' })
      }
    }
    let totalAmount = 0
    //check totalAmount
    if (foundDiscount.discount_type === DiscountType.FIXED_AMOUNT) {
      totalAmount = foundDiscount.discount_value
    } else if (foundDiscount.discount_type === DiscountType.PERCENTAGE) {
      totalAmount = (totalOrder * foundDiscount.discount_value) / 100
    }
    return {
      totalOrder,
      totalAmount,
      total: totalOrder - totalAmount
    }
  }
}

export default DiscountService
