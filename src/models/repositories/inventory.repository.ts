import { ICreateInventory } from '~/types/inventory'
import InventoryModel, { IInventory } from '../inventory.model'

export const createInventory = (payload: ICreateInventory) => {
  return InventoryModel.create(payload)
}
