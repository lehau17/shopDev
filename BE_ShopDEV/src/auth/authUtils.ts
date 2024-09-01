import jwt from 'jsonwebtoken'
import { ITokenPayload } from '~/types/TokenPayload'

const signToken = (payload: any, privateKey: string, expiresIn: string) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(
      payload,
      privateKey,
      {
        expiresIn: expiresIn
      },
      (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(res as string)
      }
    )
  })
}

export const creteTokenPair = async (payload: any, privateKey: string) => {
  try {
    const [accessToken, refreshToken] = await Promise.all([
      signToken(payload, privateKey, '2 days'),
      signToken(payload, privateKey, '7 days')
    ])

    return { accessToken, refreshToken }
  } catch (error) {
    console.log(error)
  }
}

export const verifyToken = (token: string, privateKey: string): Promise<ITokenPayload> => {
  return new Promise<ITokenPayload>((resolve, reject) => {
    jwt.verify(token, privateKey, (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(data as ITokenPayload)
    })
  })
}
