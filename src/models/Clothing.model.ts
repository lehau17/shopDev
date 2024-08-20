import mongoose, { ObjectId, Schema } from 'mongoose'

const DOCUMENT_NAME = 'Clothing'
const COLLECTION_NAME = 'Clothings'

export interface IClothing {
  _id: ObjectId
  brand: string
  size: string
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
    }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const ClothingModel = mongoose.model(DOCUMENT_NAME, clothingSchema)
export default ClothingModel
