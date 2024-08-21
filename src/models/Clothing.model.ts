import mongoose, { ObjectId, Schema } from 'mongoose'

const DOCUMENT_NAME = 'Clothing'
const COLLECTION_NAME = 'Clothings'

export interface IClothing {
  _id: ObjectId
  brand: string
  size: string
  product_shop: ObjectId
  material: string
}

const clothingSchema = new Schema<IClothing>(
  {
    brand: {
      type: String,
      required: true
    },
    size: {
      type: String
    },
    material: {
      type: String
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true
    }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const ClothingModel = mongoose.model(DOCUMENT_NAME, clothingSchema)
export default ClothingModel
