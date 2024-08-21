import express from 'express'
import { apiKey, authenticationAccessToken, permissionApiKey } from '~/auth/checkAuth'
import { checkObjectParams } from '~/auth/checkObjectId'
import ProductController from '~/controllers/product.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import { ApiKeyPermissions } from '~/utils/enums'

const productRouter = express.Router()

productRouter.use(authenticationAccessToken)
productRouter.post('/', asyncHandler(ProductController.createProduct))

productRouter.use(apiKey)
productRouter.use(permissionApiKey(ApiKeyPermissions['0000']))
productRouter.use(authenticationAccessToken)
productRouter.get('/drafts/all', asyncHandler(ProductController.getProductDraft))
productRouter.get('/published/all', asyncHandler(ProductController.getProductPublished))
productRouter.put('/published/:id', checkObjectParams, asyncHandler(ProductController.publishedOneProduct))

export default productRouter
