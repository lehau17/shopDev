// import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import cloudinary from '~/configs/cloudinary.config'
import s3Service from '~/configs/s3.config'
import { getSignedUrl } from '@aws-sdk/cloudfront-signer' // ESM

const urlCloudFront = 'https://dffpjkv0a40om.cloudfront.net/'
export const uploadSingleFile = async ({ path, folder = 'product/imgs' }: { path: string; folder?: string }) => {
  const uploadResult = await cloudinary.uploader.upload(path, {
    folder: folder
  })

  return uploadResult
}

export const uploadSingleFileUsingS3 = async (file: Express.Multer.File) => {
  const newFileName = new Date().getTime() + '_' + file.originalname
  const command = new s3Service.PutObjectCommand({
    Bucket: process.env.AWS_S3_NAME as string,
    Body: file.buffer,
    Key: newFileName,
    ContentType: 'image/jpeg'
  })

  const result = await s3Service.s3.send(command)
  // console.log('check result: ', result)
  //s3
  // const objCommand = new s3Service.GetObjectCommand({ Key: newFileName, Bucket: process.env.AWS_S3_NAME as string })
  // const url = await getSignedUrl(s3Service.s3, objCommand, { expiresIn: 3600 })
  const privateKey = process.env.AWS_CLOUDFRONT_PRIVATE_KEY as string
  // console.log('Check private key: ', privateKey)
  const signedUrl = getSignedUrl({
    url: `${urlCloudFront}${newFileName}`,
    keyPairId: process.env.AWS_CLOUDFRONT_PUBLICKEY_ID as string,
    dateLessThan: new Date(Date.now() + 360 * 1000).toISOString(),
    privateKey: privateKey
  })
  return { url: signedUrl, result }
}
