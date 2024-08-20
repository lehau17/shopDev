import express from 'express'
import { apiKey, authentication, permissionApiKey } from '~/auth/checkAuth'
import accessController from '~/controllers/access.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import { ApiKeyPermissions } from '~/utils/enums'

const accessRouter = express.Router()

accessRouter.use(apiKey)

accessRouter.use(permissionApiKey(ApiKeyPermissions['0000']))

accessRouter.post('/signup', asyncHandler(accessController.signUp))
accessRouter.post('/login', asyncHandler(accessController.login))

//authentication
accessRouter.use(authentication)
accessRouter.post('/logout', asyncHandler(accessController.logout))
accessRouter.post('/refresh-token', asyncHandler(accessController.logout))

export default accessRouter
