import NotiModel from '~/models/notification.model'
import { NotiType } from '~/utils/enums'

class NotificationService {
  static async createNotification({
    noti_type,
    noti_senderId,
    noti_receivedId,
    noti_options
  }: {
    noti_type: string
    noti_senderId: string // Shop
    noti_receivedId: number
    noti_options?: Object
  }) {
    let noti_content = ''
    if (noti_type === NotiType.PRODUCT_0001.toString()) {
      noti_content = `@@@ created product @@@@`
    } else {
      //vidu
    }
    return await NotiModel.create({ noti_type, noti_senderId, noti_receivedId, noti_options, noti_content })
  }
}

export default NotificationService
