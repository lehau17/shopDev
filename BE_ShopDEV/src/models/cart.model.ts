import { ObjectId, Schema, model, Document } from 'mongoose'
import { CartState } from '~/utils/enums'

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

export interface CartProduct {
  productId: ObjectId
  shopId: ObjectId
  quantity: number
  name: string
  price: number
}

export interface ICart extends Document {
  _id: ObjectId
  cart_state: string // active || completed || failed || pending
  cart_products: CartProduct[]
  cart_count_product: number
  cart_userId: ObjectId
}

const cartSchema = new Schema<ICart>(
  {
    cart_state: {
      type: String,
      enum: Object.values(CartState),
      default: CartState.ACTIVE
    },
    cart_products: {
      type: [
        {
          productId: { type: Schema.Types.ObjectId, required: true },
          shopId: { type: Schema.Types.ObjectId, required: true },
          quantity: { type: Number, required: true },
          name: { type: String, required: true },
          price: { type: Number, required: true }
        }
      ],
      default: []
    },
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: Schema.Types.ObjectId, required: true }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const CartModel = model<ICart>(DOCUMENT_NAME, cartSchema)

export default CartModel
