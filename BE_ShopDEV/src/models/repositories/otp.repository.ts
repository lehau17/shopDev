import OtpModel from '../otp.model'

export const deleteOtpByToken = async (token: string) => {
  return OtpModel.deleteOne({ otp_token: token })
}

export const getOtpByToken = async (token: string) => {
  return OtpModel.findOne({ otp_token: token }).lean()
}
