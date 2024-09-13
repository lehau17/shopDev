import mongoose, { ObjectId, Schema } from 'mongoose'

const DOCUMENT_NAME = 'Resource'
const COLLECTION_NAME = 'Resources'

export interface IResource {
  _id: ObjectId
  src_name: string
  src_slug: string // danh dau
  src_description: string
}

const resourceSchema = new Schema<IResource>(
  {
    src_name: { type: String, required: true },
    src_slug: { type: String, required: true },
    src_description: { type: String, default: '' }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const ResourceModel = mongoose.model(DOCUMENT_NAME, resourceSchema)
export default ResourceModel
