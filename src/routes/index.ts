import express from 'express'
import accessRouter from './access'

const router = express.Router()

router.use('/shop', accessRouter)
export default router
