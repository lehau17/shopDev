import mongoose, { ObjectId, Schema } from 'mongoose' // Erase if already required
import { DiscountApplyTo, DiscountType } from '~/utils/enums'

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

export interface IDiscount {
  _id: ObjectId
  discount_name: string
  discount_description: string
  discount_type: string
  discount_value: number
  discount_code: string
  discount_start_date: Date
  discount_end_date: Date
  discount_max_uses: number
  discount_uses_count: number
  discount_user_used: ObjectId[]
  discount_max_uses_per_user: number
  discount_min_order_value: number
  discount_shopId: ObjectId
  discount_is_active: boolean
  discount_applies_to: string
  discount_products_id: ObjectId[]
}

const discountSchema = new mongoose.Schema<IDiscount>(
  {
    discount_name: {
      type: String,
      required: true
    },
    discount_description: {
      type: String,
      required: true
    },
    discount_type: {
      type: String,
      enum: Object.values(DiscountType),
      default: DiscountType.FIXED_AMOUNT
    },
    discount_value: {
      type: Number,
      required: true
    },
    discount_code: {
      type: String,
      required: true
    },
    discount_start_date: {
      type: Date,
      required: true
    },
    discount_end_date: {
      type: Date,
      required: true
    },
    discount_max_uses: {
      type: Number,
      default: 0
    },
    discount_uses_count: {
      type: Number,
      required: true
    },
    discount_user_used: {
      type: [Schema.Types.ObjectId],
      default: []
    },
    discount_max_uses_per_user: {
      type: Number,
      default: 10
    },
    discount_min_order_value: {
      type: Number,
      default: 10000
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    discount_is_active: {
      type: Boolean,
      default: true
    },
    discount_applies_to: {
      type: String,
      enum: Object.values(DiscountApplyTo),
      required: true
    },
    discount_products_id: {
      type: [Schema.Types.ObjectId],
      default: []
    }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const DiscountModel = mongoose.model(DOCUMENT_NAME, discountSchema)
export default DiscountModel
