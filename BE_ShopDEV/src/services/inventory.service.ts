import { BadRequestResponse, NotFoundResponse } from '~/core/error.response'
import InventoryModel from '~/models/inventory.model'
import { findProductById } from '~/models/repositories/product.repository'

class InventoryService {
  static async addStockToInventory({
    productId,
    quantity,
    shopId,
    location = '123 phuong 3'
  }: {
    productId: string
    quantity: number
    shopId: string
    location?: string
  }) {
    const foundProduct = await findProductById(productId)
    if (!foundProduct) throw new NotFoundResponse({ message: 'Product not found' })
    return InventoryModel.updateOne(
      { inven_productId: productId, inven_shopId: shopId },
      { $inc: { inven_stock: +quantity, inven_location: location } },
      { new: true, upsert: true }
    )
  }
}

export default InventoryService
