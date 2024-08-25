import DiscountModel, { IDiscount } from '../discount.model'

export const findDiscountByCodeAndShop = ({ code, shopId }: { code: string; shopId: String }) => {
  return DiscountModel.findOne({ discount_code: code, discount_shopId: shopId })
}
