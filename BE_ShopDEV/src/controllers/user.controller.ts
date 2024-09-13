import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { Created, Ok } from '~/core/success.response'
import { createUser, verifyRegisterUser, getProfileUser } from '~/services/user.service'
class UserController {
  static async registerUser(req: Request<ParamsDictionary, any, { email: string }>, res: Response) {
    new Created({
      message: 'Đăng ký tài khoản thành công, hệ thông gửi Email xác nhận tài khoản',
      metadata: await createUser({ email: req.body.email })
    }).send(res)
  }

  static async verifyRegisterUser(req: Request, res: Response) {
    const token = req.query.token as string
    new Ok({ message: 'Register user successfully', metadata: await verifyRegisterUser(token) }).send(res)
  }

  static async getProfile(req: Request, res: Response) {
    const uid = req.query.id as string
    new Ok({ message: 'Profile', metadata: await getProfileUser({ usr_id: +uid }) }).send(res)
  }
}
export default UserController
