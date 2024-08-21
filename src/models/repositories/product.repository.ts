import ProductModel from '../Product.model'

export const findProductIsDraft = async ({
  filter,
  limit = 50,
  page = 0
}: {
  filter: Object
  limit?: number
  page?: number
}) => {
  return await ProductModel.find(filter)
    .populate('product_shop', 'name email -_id')
    .skip(page * limit)
    .limit(limit)
    .lean()
    .exec()
}

export const findProductIsPublished = async ({
  filter,
  limit = 50,
  page = 0
}: {
  filter: Object
  limit?: number
  page?: number
}) => {
  return await ProductModel.find(filter)
    .populate('product_shop', 'name email -_id')
    .skip(page * limit)
    .limit(limit)
    .lean()
    .exec()
}

export const publishedOneProduct = async (query: Object) => {
  const foundProduct = await ProductModel.findOne(query)
  if (!foundProduct) return null
  foundProduct.isDraft = false
  foundProduct.isPublished = true
  const productUpdated = await foundProduct.save()
  return productUpdated
}
