import express from 'express'
import accessRouter from './access'
import productRouter from './product'
import discountRoute from './discount'
import cartRouter from './cart'
import checkoutRouter from './checkout'
import inventoryRouter from './inventory'
import commentRouter from './Comment'

const router = express.Router()

router.use('/shop', accessRouter)
router.use('/products', productRouter)
router.use('/discounts', discountRoute)
router.use('/carts', cartRouter)
router.use('/checkout', checkoutRouter)
router.use('/inven', inventoryRouter)
router.use('/comments', commentRouter)
export default router
