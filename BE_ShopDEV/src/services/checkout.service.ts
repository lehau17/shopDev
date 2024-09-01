import { BadRequestResponse } from '~/core/error.response'
import { findCartById } from '~/models/repositories/cart.repository'
import { checkProductAvailability } from '~/models/repositories/product.repository'
import DiscountService from './discount.service'
import { acquireLock, releaseLock } from './redis.service'
import OrderModel from '~/models/order.model'

interface ShopOrder {
  shopId: string
  shop_discount: { shopId: string; discountId: string; code: string }[]
  item_products: { price: string; quantity: number; product_id: string }[]
}
class CheckoutService {
  static async checkoutReview({ cardId, userId, shop_order_ids }: { cardId: string; userId: string; shop_order_ids: ShopOrder[] }) {
    // check cardId
    const foundCart = await findCartById(cardId)
    if (!foundCart) throw new BadRequestResponse({ message: 'Not Found Cart' })
    const checkoutOrder = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0
      },
      shop_order_ids_new = []
    //total bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const { item_products, shopId, shop_discount = [] } = shop_order_ids[i]
      //check product
      const checkProductByServer = await checkProductAvailability(item_products)
      if (!checkProductByServer[0]) {
        throw new BadRequestResponse({ message: 'wrong product' })
      }
      const checkoutPrice = checkProductByServer.reduce(
        (
          acc: number,
          item: {
            price: number
            quantity: number
            productId: string
            shopId: string
            name: string
          }
        ) => {
          if (item) {
            return acc + item.price * item.quantity
          }
          return 0
        },
        0
      )
      checkoutOrder.totalPrice += checkoutPrice
      const itemCheckout = {
        shopId,
        shop_discount,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products
      }
      if (shop_discount.length > 0) {
        const { totalAmount } = await DiscountService.getDiscountAmount({
          code: shop_discount[0].code,
          userId: userId,
          shopId: shopId,
          products: checkProductByServer
        })
        checkoutOrder.totalDiscount += totalAmount
        if (totalAmount > 0) {
          itemCheckout.priceApplyDiscount -= totalAmount
        }
      }
      checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount
      shop_order_ids_new.push(itemCheckout)
    }
    return { shop_order_ids_new, shop_order_ids, checkoutOrder }
  }

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    userAddress,
    userPayment
  }: {
    shop_order_ids: ShopOrder[]
    cartId: string
    userId: string
    userAddress?: Object
    userPayment?: Object
  }) {
    const { shop_order_ids_new } = await CheckoutService.checkoutReview({ cardId: cartId, userId, shop_order_ids })
    const products = shop_order_ids_new.flatMap((order) => order.item_products)
    console.log('check product>>>', products)
    const acquireProduct = []
    for (let i = 0; i < products.length; i++) {
      const { product_id, quantity, price } = products[i]
      // sử dụng khóa bi quan, khóa lạc quan
      const keyLock = await acquireLock(product_id, quantity, cartId)
      acquireProduct.push(keyLock ? true : false)
      if (keyLock) {
        await releaseLock(keyLock)
      }
    }
    if (acquireProduct.includes(false)) {
      throw new BadRequestResponse({ message: 'few products updated, please try again' })
    }
    //gia su tao order thanh cong

    const orderCreated = await OrderModel.create({
      order_payment: userPayment,
      order_products: products,
      order_shipping: userAddress,
      order_userId: userId
    })
    if (orderCreated) {
      //remove cart
      // await
    }
  }
}

export default CheckoutService
