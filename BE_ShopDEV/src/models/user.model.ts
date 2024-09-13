import mongoose, { ObjectId, Schema } from 'mongoose'

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'User'

export interface IUserSchema {
  _id: ObjectId
  usr_id: number
  usr_slug: string
  usr_name: string
  usr_password: string
  usr_salt: string
  usr_email: string
  usr_phone: string
  usr_sex: string
  usr_avatar: string
  usr_date_of_birth: Date
  usr_role: ObjectId
  usr_status: string
}

const userSchema = new Schema<IUserSchema>(
  {
    usr_id: { type: Number, required: true },
    usr_slug: { type: String, required: true },
    usr_name: { type: String, default: '' },
    usr_password: { type: String, default: '' },
    usr_email: { type: String, required: true },
    usr_phone: { type: String, default: '' },
    usr_sex: { type: String, default: '' },
    usr_avatar: { type: String, default: '' },
    usr_salt: { type: String, default: '' },
    usr_date_of_birth: { type: Date, default: new Date() },
    usr_role: { type: Schema.Types.ObjectId, required: true },
    usr_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const UserModel = mongoose.model(DOCUMENT_NAME, userSchema)
export default UserModel
