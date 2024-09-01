import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({
  region: 'ap-southeast-1',
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string
  }
})

const s3Service = { s3, PutObjectCommand, GetObjectCommand }
export default s3Service
