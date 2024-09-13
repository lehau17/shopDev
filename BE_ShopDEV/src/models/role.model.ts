import mongoose, { ObjectId, Schema } from 'mongoose'

const DOCUMENT_NAME = 'Role'
const COLLECTION_NAME = 'Roles'

export interface IRole {
  _id: ObjectId
  rol_name: string
  rol_slug: string
  rol_status: string
  rol_grants: {
    resource: ObjectId
    actions: string[]
    attributes: string
  }[]
}

const roleSchema = new Schema<IRole>(
  {
    rol_name: { type: String, default: 'user', enum: ['user', 'shop', 'admin'] },
    rol_slug: { type: String, required: true },
    rol_status: { type: String, default: 'active', enum: ['active', 'pending', 'block'] },
    rol_grants: [
      {
        resource: { type: Schema.Types.ObjectId, ref: 'Resourse', required: true },
        actions: { type: [String], required: true },
        attributes: { type: String, default: '*' }
      }
    ]
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const RoleModel = mongoose.model(DOCUMENT_NAME, roleSchema)
export default RoleModel
