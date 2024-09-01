export interface ICreateInventory {
  inven_productId: string
  inven_shopId: string
  inven_stock: number
  inven_location?: string
  inven_reservations?: any[]
}
