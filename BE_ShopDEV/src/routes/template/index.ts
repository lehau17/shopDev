import express from 'express'
import TemplateController from '~/controllers/template.controller'
import { asyncHandler } from '~/helpers/asyncHandler'

const templateRouter = express.Router()

templateRouter.post('/', asyncHandler(TemplateController.createTemplate))

export default templateRouter
