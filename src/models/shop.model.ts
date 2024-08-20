import mongoose, { ObjectId, Schema } from 'mongoose' // Erase if already required
import { StatusShop } from '~/utils/enums'

const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'

export interface IShop {
  _id: ObjectId
  name: string
  email: string
  password: string
  status: string
  verify: boolean
  roles: [string]
}

// Declare the Schema of the Mongo model
const shopSchema = new mongoose.Schema<IShop>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(StatusShop),
      default: StatusShop.INACTIVE
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false
    },
    roles: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

//Export the model
const ShopModel = mongoose.model(DOCUMENT_NAME, shopSchema)
export default ShopModel
