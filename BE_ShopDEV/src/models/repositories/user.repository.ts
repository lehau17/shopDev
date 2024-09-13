import UserModel from '../user.model'

export const findUserByEmail = (email: string) => {
  return UserModel.findOne({ usr_email: email }).lean()
}
