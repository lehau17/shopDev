import mongoose, { ObjectId, Schema } from 'mongoose'

const DOCUMENT_NAME = 'Otp'
const COLLECTION_NAME = 'Otps'

export interface IOtp {
  _id: ObjectId
  otp_token: string
  otp_email: string
  otp_status: string
  otp_expireAt: Date
}

const otpSchema = new Schema<IOtp>(
  {
    otp_token: { type: 'string', required: true },
    otp_email: { type: 'string', required: true },
    otp_expireAt: { type: Date, default: new Date(), expires: 120 * 1000 },
    otp_status: { type: 'string', default: 'pending', enum: ['active', 'pending', 'block'] }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const OtpModel = mongoose.model(DOCUMENT_NAME, otpSchema)

export default OtpModel
