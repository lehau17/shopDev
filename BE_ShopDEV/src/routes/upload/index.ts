import express from 'express'
import { uploadDiskStorage, uploadMemoryDisk } from '~/configs/multer.config'
import UploadController from '~/controllers/upload.controller'
import { asyncHandler } from '~/helpers/asyncHandler'

const uploadRouter = express.Router()

uploadRouter.post('', uploadDiskStorage.single('products'), asyncHandler(UploadController.uploadSingleFile))
uploadRouter.post('/s3', uploadMemoryDisk.single('product'), asyncHandler(UploadController.uploadSingleFileUsingS3))

export default uploadRouter
