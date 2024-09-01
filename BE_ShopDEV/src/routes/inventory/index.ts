import express from 'express'
import InventoryController from '~/controllers/inventory.controller'
import { asyncHandler } from '~/helpers/asyncHandler'

const inventoryRouter = express.Router()

inventoryRouter.post('/addStock', asyncHandler(InventoryController.addStockToInventory))

export default inventoryRouter
