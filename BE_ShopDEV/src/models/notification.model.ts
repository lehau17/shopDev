import mongoose, { ObjectId, Schema } from 'mongoose'
import { NotiType } from '~/utils/enums'

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'

export interface INotification {
  _id: ObjectId
  noti_type: string
  noti_senderId: ObjectId
  noti_receivedId: number
  noti_content: string
  noti_options: Object
}

const notificationSchema = new Schema<INotification>(
  {
    noti_type: {
      type: String,
      enum: Object.values(NotiType),
      required: true
    },
    noti_senderId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    noti_receivedId: {
      type: Number,
      required: true
    },
    noti_content: { type: String, required: true },
    noti_options: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const NotiModel = mongoose.model(DOCUMENT_NAME, notificationSchema)
export default NotiModel
