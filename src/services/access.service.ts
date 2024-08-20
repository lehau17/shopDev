import ShopModel, { IShop } from '~/models/shop.model'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import KeyTokenService from './keyToken.service'
import { creteTokenPair, verifyToken } from '~/auth/authUtils'
import {
  BadRequestResponse,
  ConfigResponse,
  AuthenticationFailureResponse,
  ForbiddenResponse
} from '~/core/error.response'
import { KeyToken } from '~/models/keyToken.model'
import { findShopByIdService } from './shop.service'
const roleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}
class AccessService {
  /**
   * refresh token
   */
  static async refreshToken(refreshToken: string) {
    const foundKeyToken = await KeyTokenService.findByTokenUsed(refreshToken)
    console.log(foundKeyToken)
    if (foundKeyToken) {
      const { userId } = await verifyToken(refreshToken, foundKeyToken.privateKey)
      await KeyTokenService.removeByUserId(userId)
      throw new ForbiddenResponse({ message: 'error occurred. Please relogin' })
    }
    const holderKeyToken = await KeyTokenService.findByToken(refreshToken)
    console.log('check keyTOken>>>', holderKeyToken)
    if (!holderKeyToken)
      throw new AuthenticationFailureResponse({
        message: 'Shop is not registered'
      })
    const { userId } = await verifyToken(holderKeyToken.refreshToken, holderKeyToken.privateKey)
    const foundShop = await findShopByIdService(userId)
    if (!foundShop) {
      throw new AuthenticationFailureResponse({
        message: 'Shop is not registered'
      })
    }
    //generate tokens
    //create two keys
    const tokens = await creteTokenPair(
      { email: foundShop.email, userId: foundShop._id.toString() },
      holderKeyToken.privateKey
    )
    if (!tokens) {
      throw new BadRequestResponse({ message: 'error Occur in generate tokens' })
    }
    await holderKeyToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokenUsed: refreshToken
      }
    })
    return {
      shop: foundShop,
      tokens
    }
  }

  static async logout(keyToken: KeyToken) {
    const isDeleted = await KeyTokenService.removeById(keyToken._id)
    return isDeleted
  }

  /***
   * - check email
   * - check password hash
   * - generate public key and private key
   * - as and rs
   * - add token
   * - return
   */

  static async login({ email, password }: { email: string; password: string }) {
    const holderShop = await ShopModel.findOne<IShop>({ email }).lean()
    if (!holderShop) {
      throw new BadRequestResponse({ message: 'SHop is not available' })
    }
    if (!bcrypt.compareSync(password, holderShop.password)) {
      throw new AuthenticationFailureResponse({ message: 'Password incorrect' })
    }
    //create two keys
    const publicKey = crypto.randomBytes(64).toString('hex')
    const privateKey = crypto.randomBytes(64).toString('hex')
    //tokens generated
    const tokens = await creteTokenPair({ email, userId: holderShop._id.toString() }, privateKey)
    if (!tokens) {
      throw new BadRequestResponse({ message: 'error Occur in generate tokens' })
    }
    const publicKeyString = await KeyTokenService.createKeyToken({
      userId: holderShop._id.toString(),
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken
    })
    if (!publicKeyString) {
      throw new BadRequestResponse({ message: 'error Occur in add keyToken into dbs' })
    }
    return {
      code: 200,
      metadata: {
        shop: holderShop,
        tokens
      }
    }
  }

  static signUp = async ({ name, email, password }: { name: string; password: string; email: string }) => {
    const holderShop = await ShopModel.findOne({ email }).lean()
    if (holderShop) {
      throw new ConfigResponse({ message: `Shop with email ${email} already exists` })
    } else {
      const hashPassword = bcrypt.hashSync(password, 10)
      const shop = new ShopModel({ name, email, password: hashPassword, roles: [roleShop.SHOP] })
      const newShop = await ShopModel.create(shop)
      if (newShop) {
        // create key and public key
        const publicKey = crypto.randomBytes(64).toString('hex')
        const privateKey = crypto.randomBytes(64).toString('hex')
        //save collection key store
        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id.toString(),
          publicKey: publicKey,
          privateKey
        })
        if (!publicKeyString) {
          throw new BadRequestResponse({ message: `Error while creating key token` })
        }
        //create token pair
        const tokens = await creteTokenPair({ email, userId: newShop._id }, privateKey)
        return {
          code: 201,
          metadata: {
            shop: newShop,
            tokens
          }
        }
      } else {
        return {
          code: 200,
          metadata: null
        }
      }
    }
  }
}

export default AccessService
