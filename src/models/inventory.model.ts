import mongoose, { ObjectId, Schema } from 'mongoose'

const DOCUMENt_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

export interface IInventory {
  _id: ObjectId
  inven_productId: ObjectId
  inven_location: string
  inven_stock: number
  inven_shopId: ObjectId
  inven_reservations: any[]
}

const inventorySchema = new Schema<IInventory>(
  {
    inven_productId: {
      type: Schema.Types.ObjectId,
      require: true
    },
    inven_location: {
      type: String,
      default: 'unknown'
    },
    inven_stock: {
      type: Number,
      required: true
    },
    inven_shopId: {
      type: Schema.Types.ObjectId,
      require: true
    },
    inven_reservations: {
      type: [],
      default: []
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const InventoryModel = mongoose.model(DOCUMENt_NAME, inventorySchema)
export default InventoryModel
