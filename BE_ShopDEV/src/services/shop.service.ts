import ShopModel from '~/models/shop.model'

export const findShopByIdService = (id: string) => {
  return ShopModel.findById(id)
}
