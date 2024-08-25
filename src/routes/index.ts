import express from 'express'
import accessRouter from './access'
import productRouter from './product'
import discountRoute from './discount'
import cartRouter from './cart'

const router = express.Router()

router.use('/shop', accessRouter)
router.use('/products', productRouter)
router.use('/discounts', discountRoute)
router.use('/carts', cartRouter)
export default router
