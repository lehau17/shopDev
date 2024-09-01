import express from 'express'
import { apiKey, authenticationAccessToken, permissionApiKey } from '~/auth/checkAuth'
import CommentController from '~/controllers/comment.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import { ApiKeyPermissions } from '~/utils/enums'

const commentRouter = express.Router()

commentRouter.use(apiKey)
commentRouter.use(permissionApiKey(ApiKeyPermissions['0000']))
commentRouter.use(authenticationAccessToken)
commentRouter.post('/', asyncHandler(CommentController.createComment))
commentRouter.get('/', asyncHandler(CommentController.getComment))
commentRouter.delete('/', asyncHandler(CommentController.deleteComment))

export default commentRouter
