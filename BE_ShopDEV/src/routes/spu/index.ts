import express from 'express'
import { authenticationAccessToken } from '~/auth/checkAuth'
import SpuController from '~/controllers/spu.controller'
import { asyncHandler } from '~/helpers/asyncHandler'

const spuRouter = express.Router()
spuRouter.get('/', asyncHandler(SpuController.getOne))
spuRouter.use(authenticationAccessToken)
spuRouter.post('/new', asyncHandler(SpuController.createSpu))
export default spuRouter
