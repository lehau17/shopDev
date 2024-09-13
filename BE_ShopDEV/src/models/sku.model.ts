import mongoose, { ObjectId, Schema } from 'mongoose'

const DOCUMENT_NAME = 'Sku'
const COLLECTION_NAME = 'Skus'

export interface ISku {
  _id: ObjectId
  sku_id: string
  sku_tier_idx: number[]
  sku_default: boolean
  sku_slug: string
  sku_sort: number
  sku_price: number
  sku_stock: number
  sku_spu_id: string
  isDraft: boolean
  isPublished: boolean
  isDeleted: boolean
}

const skuSchema = new Schema<ISku>(
  {
    sku_id: { type: String, required: true },
    sku_tier_idx: { type: [Number], default: [0] },
    sku_default: { type: Boolean, default: false },
    sku_slug: { type: String, default: '' },
    sku_sort: { type: Number, default: 0 },
    sku_price: { type: Number, default: 0 },
    sku_stock: { type: Number, default: 0 },
    sku_spu_id: { type: String, required: true },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false
    },
    isPublished: {
      type: Boolean,
      default: false,
      select: false
    },
    isDeleted: { type: Boolean, default: false, select: false }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const SkuModel = mongoose.model(DOCUMENT_NAME, skuSchema)

export default SkuModel
