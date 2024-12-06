import mongoose, { ObjectId, Schema } from 'mongoose'

const DOCUMENT_NAME = 'Electronic'
const COLLECTION_NAME = 'Electronics'

export interface IElectronic {
  _id: ObjectId
  manufacturer: string
  model: string
  color: string
  product_shop: ObjectId
}

const ElectronicSchema = new Schema<IElectronic>(
  {
    manufacturer: {
      type: String,
      required: true
    },
    model: {
      type: String
    },
    color: {
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

const ElectronicModel = mongoose.model(DOCUMENT_NAME, ElectronicSchema)
export default ElectronicModel
