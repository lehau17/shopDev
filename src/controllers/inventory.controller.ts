import { Request, Response } from 'express'
import { Ok } from '~/core/success.response'
import InventoryService from '~/services/inventory.service'
import { ITokenPayload } from '~/types/TokenPayload'

class InventoryController {
  static async addStockToInventory(req: Request, res: Response) {
    const { userId } = req.decodeAccessToken as ITokenPayload
    const { productId, quantity, location } = req.body
    new Ok({
      message: 'addStockToInventory',
      metadata: await InventoryService.addStockToInventory({ productId, quantity, location, shopId: userId })
    })
  }
}

export default InventoryController
