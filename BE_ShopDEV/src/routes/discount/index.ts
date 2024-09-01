import express from 'express'
import { apiKey, authenticationAccessToken, permissionApiKey } from '~/auth/checkAuth'
import DiscountController from '~/controllers/discount.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import { ApiKeyPermissions } from '~/utils/enums'

const discountRoute = express.Router()

discountRoute.use(apiKey)
discountRoute.use(permissionApiKey(ApiKeyPermissions['0000']))
discountRoute.use(authenticationAccessToken)
discountRoute.post('', asyncHandler(DiscountController.create))
discountRoute.post('/remove', asyncHandler(DiscountController.removeDiscountWithCodeAndShopId))
discountRoute.get('/:code/products', asyncHandler(DiscountController.getAllDiscountsCodeWithProducts))

export default discountRoute
