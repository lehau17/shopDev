import { asyncHandler } from './../../helpers/asyncHandler'
import express from 'express'
import UserController from '~/controllers/user.controller'

const userRouter = express.Router()

userRouter.post('/register', asyncHandler(UserController.registerUser))
userRouter.get('/verify-user', asyncHandler(UserController.verifyRegisterUser))
userRouter.get('/', asyncHandler(UserController.getProfile))

export default userRouter
