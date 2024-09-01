import { Model, SortOrder } from 'mongoose'
import ProductModel from '../Product.model'
import { ProductTotalAmountRequest } from '~/types/product.type'

export const findProductIsDraft = async ({ filter, limit = 50, page = 0 }: { filter: Object; limit?: number; page?: number }) => {
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
  page = 0,
  sort = 'ctime'
}: {
  filter: Object
  limit?: number
  page?: number
  sort?: string
}) => {
  const sortBy: { [key: string]: SortOrder } = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  return await ProductModel.find(filter)
    .populate('product_shop', 'name email -_id')
    .skip(page * limit)
    .limit(limit)
    .sort(sortBy)
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

export const unPublishedOneProduct = async (query: Object) => {
  const foundProduct = await ProductModel.findOne(query)
  if (!foundProduct) return null
  foundProduct.isDraft = true
  foundProduct.isPublished = false
  const productUpdated = await foundProduct.save()
  return productUpdated
}

export const findByKeyword = async ({ keyword }: { keyword: string }) => {
  const result = await ProductModel.find(
    {
      $text: { $search: keyword }
    },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } })
  return result
}

export const findAllProducts = async ({
  limit,
  page,
  sort,
  select,
  filter
}: {
  limit: number
  page: number
  sort: { [key: string]: SortOrder }
  select: Record<string, number>
  filter: Object
}) => {
  const result = await ProductModel.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sort)
    .select(select)
    .lean()
  return result
}

export const findProduct = async ({ product_id, unselect }: { product_id: string; unselect: Record<string, number> }) => {
  const result = await ProductModel.findById(product_id).select(unselect).lean()
  return result
}

export const updateProductById = async <T>({
  _id,
  model,
  payload,
  returnNew = true
}: {
  _id: string
  model: Model<any>
  payload: Partial<T>
  returnNew?: boolean
}) => {
  const updatedProduct = await model.findByIdAndUpdate(_id, payload, { new: returnNew }).lean()
  return updatedProduct
}

export const findProductById = async (_id: string) => {
  return await ProductModel.findById(_id)
}

export const checkProductAvailability = async (products: { price: string; quantity: number; product_id: string }[]): Promise<any> => {
  return Promise.all(
    products.map(async (product) => {
      const foundProduct = await findProductById(product.product_id)
      if (foundProduct) {
        return {
          price: foundProduct.product_price,
          quantity: product.quantity,
          productId: foundProduct._id.toString(),
          shopId: foundProduct.product_shop.toString(),
          name: foundProduct.product_name
        }
      }
      return null
    })
  )
}
