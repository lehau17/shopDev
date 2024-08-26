import { ObjectId, Schema, model } from 'mongoose'

const DOCUMENT_NAME = 'Comment'
const COLLECTION_NAME = 'Comments'

export interface IComment {
  _id: ObjectId
  comment_productId: ObjectId
  comment_content: string
  comment_userId: ObjectId
  comment_parentId: ObjectId
  comment_left: number
  comment_right: number
  isDeleted: boolean
}

const CommentSchema = new Schema<IComment>(
  {
    comment_productId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    comment_content: {
      type: String,
      required: true
    },
    comment_userId: { type: Schema.Types.ObjectId, required: true },
    comment_parentId: { type: Schema.Types.ObjectId, default: null },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const CommentModel = model<IComment>(DOCUMENT_NAME, CommentSchema)

export default CommentModel
