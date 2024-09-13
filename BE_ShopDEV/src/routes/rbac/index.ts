import express from 'express'
import RbacController from '~/controllers/rbac.controller'
import { asyncHandler } from '~/helpers/asyncHandler'

const rbacRouter = express.Router()

rbacRouter.post('/resource', asyncHandler(RbacController.createResource))
rbacRouter.post('/role', asyncHandler(RbacController.createRole))
rbacRouter.get('/role', asyncHandler(RbacController.getRole))
rbacRouter.get('/resource', asyncHandler(RbacController.getResource))

export default rbacRouter
