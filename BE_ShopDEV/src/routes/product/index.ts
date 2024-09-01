import { findProduct } from './../../models/repositories/product.repository'
import express from 'express'
import { apiKey, authenticationAccessToken, permissionApiKey } from '~/auth/checkAuth'
import { checkObjectParams } from '~/auth/checkObjectId'
import ProductController from '~/controllers/product.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import { ApiKeyPermissions } from '~/utils/enums'

const productRouter = express.Router()
//findALl
productRouter.get('/', asyncHandler(ProductController.findAllProduct))
productRouter.get('/:id', checkObjectParams, asyncHandler(ProductController.findProduct))

productRouter.use(authenticationAccessToken)

productRouter.use(apiKey)
productRouter.use(permissionApiKey(ApiKeyPermissions['0000']))
productRouter.post('/', asyncHandler(ProductController.createProduct))
productRouter.patch('/:id', asyncHandler(ProductController.updateProduct))
productRouter.use(authenticationAccessToken)
productRouter.get('/drafts/all', asyncHandler(ProductController.getProductDraft))
productRouter.get('/drafts/:id', asyncHandler(ProductController.unPublishedOneProduct))
productRouter.get('/published/all', asyncHandler(ProductController.getProductPublished))
productRouter.put('/published/:id', checkObjectParams, asyncHandler(ProductController.publishedOneProduct))

export default productRouter
