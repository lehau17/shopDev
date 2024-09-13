import { Schema } from 'mongoose'
import { NotFoundResponse } from '~/core/error.response'
import CartModel, { CartProduct } from '~/models/cart.model'
import { findProduct } from '~/models/repositories/product.repository'
import { CartCreateRequestBody, UpdateCartRequestBody } from '~/types/cart.type'
import { convertStringToObjectId, unSelectDataInfo } from '~/utils/convertData'
import { CartState } from '~/utils/enums'

class CartService {
  static async getCart(user_id: string) {
    //find in cache
    return CartModel.findOne({ cart_userId: user_id }).lean()
  }
  static async create(body: CartCreateRequestBody) {
    return CartModel.create(body)
  }

  static async updateUserCartQuantity(userId: string, product: CartProduct) {
    // const cartFound
    const { productId, quantity } = product
    const query = {
      cart_userId: userId,
      'cart_products.productId': productId,
      cart_state: 'active'
    }
    const updateSet = {
      $inc: {
        'cart_products.$.quantity': quantity
      }
    }

    const options = { new: true, upsert: true }
    return await CartModel.findOneAndUpdate(query, updateSet, options)
  }

  /**
   * {
   *    shop_product_ids:{
         shopId
         items_product:
   * }tang so luong
   */
  static async addToCart(body: UpdateCartRequestBody, user_id: string) {
    const { productId, quantity, old_quantity, price } = body.shop_order_id[0].item_products[0]
    //check existing productId
    const foundProduct = await findProduct({ product_id: productId, unselect: unSelectDataInfo({ unSelect: ['__v'] }) })
    if (!foundProduct) throw new NotFoundResponse({ message: 'Product not found' })
    if (foundProduct.product_shop.toString() !== body.shop_order_id[0].shopId)
      throw new NotFoundResponse({ message: 'Product is not belong to this shop' })
    if (quantity === 0) {
      //xoa
      return CartService.deleteItem(productId, user_id)
    }
    return CartService.updateUserCartQuantity(user_id, {
      productId: new Schema.Types.ObjectId(productId),
      shopId: foundProduct.product_shop,
      quantity: quantity - old_quantity,
      price: price,
      name: foundProduct.product_name
    })
  }

  static async deleteItem(productId: string, user_id: string) {
    return CartModel.updateOne({ cart_userId: user_id, cart_state: CartState.ACTIVE }, { $pull: { cart_products: productId } })
  }

  //get list user's cart
  static async getCartByUser({ userId }: { userId: string }) {
    return CartModel.findOne({ cart_userId: userId }).lean()
  }
}

export default CartService
