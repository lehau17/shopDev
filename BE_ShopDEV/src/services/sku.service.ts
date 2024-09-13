import SkuModel from '~/models/sku.model'
import { randomId } from '~/utils'

export const createSkus = async ({ spu_id, list }: { spu_id: string; list: Object[] }) => {
  const newObject = list.map((e) => {
    return { ...e, sku_spu_id: spu_id, sku_id: `sku_spu_id.${randomId()}` }
  })
  return await SkuModel.create(newObject)
}
