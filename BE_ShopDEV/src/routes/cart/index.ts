import express from 'express'
import CartController from '~/controllers/cart.controller'
import { asyncHandler } from '~/helpers/asyncHandler'

const cartRouter = express.Router()

cartRouter.post('/', asyncHandler(CartController.createCart))
cartRouter.post('/add-to-cart', asyncHandler(CartController.addToCart))

export default cartRouter
