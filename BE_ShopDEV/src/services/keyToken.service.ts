import { Schema } from 'mongoose'
import KeyModel from '~/models/keyToken.model'

class KeyTokenService {
  static async removeById(_id: Schema.Types.ObjectId) {
    return KeyModel.deleteMany({ _id: _id })
  }

  static async findByTokenUsed(token: string) {
    return KeyModel.findOne({ refreshTokenUsed: token }).lean()
  }

  static async findByToken(token: string) {
    return KeyModel.findOne({ refreshToken: token })
  }

  static async createKeyToken({
    userId,
    publicKey,
    privateKey,
    refreshToken
  }: {
    userId: string
    publicKey: string
    privateKey: string
    refreshToken?: string
  }) {
    const token = await KeyModel.findOneAndUpdate(
      {
        user: userId
      },
      {
        $set: {
          publicKey,
          privateKey,
          refreshToken
        }
      },
      {
        new: true,
        upsert: true
      }
    )
    return token ? token.publicKey : null
  }

  static async findByUserId(userId: string) {
    return KeyModel.findOne({ user: userId })
  }

  static async removeByUserId(userId: string) {
    return KeyModel.findOneAndDelete({ user: userId }).lean()
  }
}

export default KeyTokenService
