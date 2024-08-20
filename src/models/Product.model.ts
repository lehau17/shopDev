import mongoose, { ObjectId, Schema } from 'mongoose'
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
      type: Schema,
      required: true
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true
    }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const ProductModel = mongoose.model(DOCUMENT_NAME, productSchema)
export default ProductModel
