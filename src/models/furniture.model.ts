import mongoose, { ObjectId, Schema } from 'mongoose'

const DOCUMENT_NAME = 'Furniture'
const COLLECTION_NAME = 'Furnitures'

export interface IFurniture {
  _id: ObjectId
  model: string
  color: string
  product_shop: ObjectId
}

const furnitureSchema = new Schema<IFurniture>(
  {
    color: {
      type: 'string'
    },
    model: {
      type: 'string',
      required: true
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true
    }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const FurnitureModel = mongoose.model(DOCUMENT_NAME, furnitureSchema)
export default FurnitureModel
