import express from 'express'
import accessRouter from './access'
import productRouter from './product'

const router = express.Router()

router.use('/shop', accessRouter)
router.use('/products', productRouter)
export default router
