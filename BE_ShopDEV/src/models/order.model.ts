import mongoose, { ObjectId, Schema } from 'mongoose' // Erase if already required
import { OrderStatus } from '~/utils/enums'

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

export interface IOrder {
  _id: ObjectId
  order_userId: ObjectId
  order_checkout: Object
  order_shipping: Object
  order_payment: Object
  order_products: any[]
  order_trackingNumber: string
  order_status: string
}

// Declare the Schema of the Mongo model
const OrderTokenSchema = new mongoose.Schema<IOrder>(
  {
    order_userId: {
      type: Schema.Types.ObjectId,
      require: true
    },
    order_checkout: {
      type: Object,
      default: {}
    },
    order_shipping: {
      type: Object,
      default: {}
    },
    order_payment: {
      type: Object,
      default: {}
    },
    order_products: {
      type: [],
      default: []
    },
    order_trackingNumber: {
      type: String,
      default: '#000012582024'
    },
    order_status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

//Export the model
const OrderModel = mongoose.model(DOCUMENT_NAME, OrderTokenSchema)
export default OrderModel
