import express from 'express'
import { apiKey, authenticationAccessToken, permissionApiKey } from '~/auth/checkAuth'
import CheckoutController from '~/controllers/checkout.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import { ApiKeyPermissions } from '~/utils/enums'

const checkoutRouter = express.Router()
checkoutRouter.use(apiKey)
checkoutRouter.use(permissionApiKey(ApiKeyPermissions['0000']))
checkoutRouter.use(authenticationAccessToken)
checkoutRouter.get('/review', asyncHandler(CheckoutController.reviewOrder))

export default checkoutRouter
