import { v2 as cloudinary } from 'cloudinary'
// Configuration
cloudinary.config({
  cloud_name: 'ddb1eodac',
  api_key: '574215254685364',
  api_secret: process.env.CLOUDINARY_CLOUD_SERCET_KEY as string
})
export default cloudinary
