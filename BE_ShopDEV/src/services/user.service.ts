import { BadRequestResponse, ConfigResponse, NotFoundResponse } from '~/core/error.response'
import { findUserByEmail } from '~/models/repositories/user.repository'
import { sendEmail } from './email.service'
import UserModel, { IUserSchema } from '~/models/user.model'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import KeyTokenService from './keyToken.service'
import { creteTokenPair } from '~/auth/authUtils'
import RoleModel from '~/models/role.model'
import transporter from '~/configs/nodemailer.gmail.config'
import { deleteOtpByToken, getOtpByToken } from '~/models/repositories/otp.repository'
import { getRedis } from '~/configs/redis.config'
const { instanceRedis } = getRedis()

export const createUser = async ({ email }: { email: string }) => {
  //check exist user by email
  const foundUser = await findUserByEmail(email)
  if (foundUser) {
    throw new BadRequestResponse({ message: `User ${foundUser.usr_email} already exists` })
  }
  // send email notification
  const isSuccess = await sendEmail(email, 'TEMPLATE-REGISTER_USER', 'Xác nhận tài khoản')
  return { isSuccess }
}

export const verifyRegisterUser = async (token: string) => {
  //1. check token exists
  const foundToken = await getOtpByToken(token)
  if (!foundToken) {
    throw new BadRequestResponse({ message: 'Hết hạn xác thực tài khoản, vui lòng thử lại' })
  }
  //2. check email and delete otp
  const email = foundToken.otp_email
  const [hasUser] = await Promise.all([await findUserByEmail(email), await deleteOtpByToken(token)])

  if (hasUser) {
    throw new ConfigResponse({ message: 'User already exists' })
  }
  //3. Create User
  const hashPassword = bcrypt.hashSync(email, 10)
  const randomId = crypto.randomInt(0, Math.pow(2, 32))
  // get role default:User
  const foundRoleUser = await RoleModel.findOne({ rol_name: 'admin' })
  if (!foundRoleUser) throw new NotFoundResponse({ message: 'Role not found' })
  const newUser = await UserModel.create({
    usr_id: randomId,
    usr_slug: `u${randomId}`,
    usr_email: email,
    usr_password: hashPassword,
    usr_role: foundRoleUser._id
  })
  if (newUser) {
    // create key and public key
    const publicKey = crypto.randomBytes(64).toString('hex')
    const privateKey = crypto.randomBytes(64).toString('hex')
    //save collection key store and send notification to email

    const publicKeyString = await KeyTokenService.createKeyToken({
      userId: newUser._id.toString(),
      publicKey: publicKey,
      privateKey
    })
    transporter.sendMail(
      {
        from: 'lehau17131203@gmail.com',
        to: email,
        subject: 'Cấp mật khẩu tạm thời',
        text: 'Mật khẩu tạm thời của bạn là: ' + email
        // html:
      },
      (err, info) => {
        if (err) throw err
        console.log(info)
      }
    )

    if (!publicKeyString) {
      throw new BadRequestResponse({ message: `Error while creating key token` })
    }
    //create token pair
    const tokens = await creteTokenPair({ email, userId: newUser._id }, privateKey)
    return {
      code: 201,
      metadata: {
        user: newUser,
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

export const getProfileUser = async ({ usr_id }: { usr_id: number }): Promise<IUserSchema | undefined> => {
  // get cache
  const foundUserRedis = await instanceRedis.get(`uid:${usr_id}`)
  if (foundUserRedis) {
    console.log('Lay trong redis')
    return JSON.parse(foundUserRedis)
  }

  // get dbs
  const foundUserDb = await UserModel.findOne({ usr_id: usr_id })
  if (!foundUserDb) {
    throw new NotFoundResponse({ message: 'User not found' })
  }
  //set cache and return
  await instanceRedis.set(`uid:${usr_id}`, JSON.stringify(foundUserDb), { EX: 300 })
  console.log('Lay trong db')

  return foundUserDb
}
