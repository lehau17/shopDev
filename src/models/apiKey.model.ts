import mongoose, { ObjectId, Schema } from 'mongoose'
import { ApiKeyPermissions } from '~/utils/enums'

const DOCUMENT_NAME = 'ApiKey'
const COLLECTION_NAME = 'ApiKeys'

export interface IApiKey {
  _id: ObjectId
  key: string
  status: boolean
  permissions: [string]
  createdAt: Date
  updatedAt: Date
}

const apiKeySchema = new Schema<IApiKey>(
  {
    key: {
      type: String,
      unique: true,
      required: true
    },
    status: {
      type: Boolean,
      default: true
    },
    permissions: {
      type: [String],
      enum: Object.values(ApiKeyPermissions),
      required: true
    }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const ApiKeyModel = mongoose.model(DOCUMENT_NAME, apiKeySchema)
export default ApiKeyModel
