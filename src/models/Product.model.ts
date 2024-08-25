import mongoose, { ObjectId, Schema } from 'mongoose'
import slugify from 'slugify'
import { ProductType } from '~/utils/enums'

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

export interface IProduct {
  _id: ObjectId
  product_name: string
  product_thumb: string
  product_description: string
  product_price: number

  product_quantity: number
  product_type: string
  product_shop: ObjectId
  product_attributes: Object

  //bonus
  product_slug: string //le_trung_hau
  product_rating_avg: number
  product_variations: string[]
  isDraft: boolean
  isPublished: boolean
}

const productSchema = new Schema<IProduct>(
  {
    product_name: {
      type: String,
      required: true
    },
    product_thumb: {
      type: String,
      required: true
    },
    product_description: {
      type: String
    },
    product_price: {
      type: Number,
      required: true
    },
    product_quantity: {
      type: Number,
      required: true
    },
    product_type: {
      type: String,
      enum: Object.values(ProductType),
      required: true
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true
    },
    product_slug: {
      type: String
    },
    product_rating_avg: {
      type: Number,
      default: 4.5,
      min: 1,
      set: (value: number) => Math.round(value * 10) / 10
    },
    product_variations: {
      type: [String],
      default: []
    },
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
    }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

//index
productSchema.index({ product_name: 'text', product_description: 'text' })

productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true })
  next()
})

const ProductModel = mongoose.model(DOCUMENT_NAME, productSchema)
export default ProductModel
