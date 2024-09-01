import { Ok } from '~/core/success.response'
import { uploadSingleFile, uploadSingleFileUsingS3 } from '~/services/upload.service'
import { Request, Response } from 'express'
import { BadRequestResponse } from '~/core/error.response'
class UploadController {
  static async uploadSingleFile(req: Request, res: Response) {
    const { file } = req
    // console.log(req.file)
    if (!file) throw new BadRequestResponse({ message: 'File not found' })
    new Ok({ message: 'Uploaded img', metadata: await uploadSingleFile({ path: file.path }) }).send(res)
  }

  static async uploadSingleFileUsingS3(req: Request, res: Response) {
    const { file } = req
    console.log(req.file)
    if (!file) throw new BadRequestResponse({ message: 'File not found' })
    new Ok({ message: 'Uploaded img', metadata: await uploadSingleFileUsingS3(file) }).send(res)
  }
}

export default UploadController
