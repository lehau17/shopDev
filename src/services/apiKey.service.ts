import ApiKeyModel from '~/models/apiKey.model'
import crypto from 'crypto'
import { ApiKeyPermissions } from '~/utils/enums'
export const apiKeyFindByKeyService = async (key: string) => {
  await ApiKeyModel.create({
    key: crypto.randomBytes(64).toString('hex'),
    status: true,
    permissions: [ApiKeyPermissions['0000']]
  })
  return ApiKeyModel.findOne({ key, status: true }).lean()
}
