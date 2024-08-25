import { ObjectId } from 'mongoose'

export interface CartProduct {
  productId: string
  shopId: string
  quantity: number
  name: string
  price: number
}

export interface CartCreateRequestBody {
  cart_state?: string
  cart_products?: CartProduct[]
  cart_count_product?: number
  cart_userId: string
}

interface ItemProduct {
  quantity: number
  price: number
  shopId: string
  old_quantity: number
  productId: string
}
interface ItemShopOrder {
  shopId: string
  item_products: ItemProduct[]
}
export interface UpdateCartRequestBody {
  shop_order_id: ItemShopOrder[]
}
