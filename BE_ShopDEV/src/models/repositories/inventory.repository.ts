import { ICreateInventory } from '~/types/inventory'
import InventoryModel, { IInventory } from '../inventory.model'

export const createInventory = (payload: ICreateInventory) => {
  return InventoryModel.create(payload)
}

export const reservationInventory = ({ productId, quantity, cartId }: { productId: string; quantity: number; cartId: string }) => {
  return InventoryModel.updateOne(
    { inven_productId: productId, inven_stock: { $gte: quantity } },
    {
      $inc: { inven_stock: -quantity },
      $push: {
        inven_reservations: {
          quantity: quantity,
          cartId: cartId,
          createOn: new Date()
        }
      }
    },
    {
      upsert: true,
      new: true
    }
  )
}
