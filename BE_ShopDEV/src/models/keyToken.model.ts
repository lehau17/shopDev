import mongoose, { ObjectId, Schema } from 'mongoose' // Erase if already required

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

export interface KeyToken {
  _id: ObjectId
  user: ObjectId
  publicKey: string
  privateKey: string
  refreshTokenUsed: [string]
  refreshToken: string
  createdAt: Date
  updatedAt: Date
}

// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema<KeyToken>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true
    },
    publicKey: {
      type: String,
      required: true
    },
    privateKey: {
      type: String,
      required: true
    },
    refreshTokenUsed: {
      type: [String],
      default: []
    },
    refreshToken: {
      type: String,
      required: true
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

//Export the model
const KeyModel = mongoose.model(DOCUMENT_NAME, keyTokenSchema)
export default KeyModel
