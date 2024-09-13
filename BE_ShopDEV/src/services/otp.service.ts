import crypto from 'crypto'
import OtpModel from '~/models/otp.model'
const generateToken = () => {
  return crypto.randomInt(0, Math.pow(2, 32))
}

export const createOtp = ({ email }: { email: string }) => {
  const token = generateToken()
  return OtpModel.create({ otp_email: email, otp_token: token })
}
