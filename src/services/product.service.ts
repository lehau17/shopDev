import { SortOrder } from 'mongoose'
import { Schema } from 'mongoose'
import { BadRequestResponse, NotFoundResponse } from '~/core/error.response'
import ClothingModel from '~/models/Clothing.model'
import ElectronicModel from '~/models/Electronic.model'
import FurnitureModel from '~/models/furniture.model'
import ProductModel, { IProduct } from '~/models/Product.model'
import { createInventory } from '~/models/repositories/inventory.repository'
import {
  findAllProducts,
  findByKeyword,
  findProduct,
  findProductIsDraft,
  publishedOneProduct,
  unPublishedOneProduct,
  updateProductById
} from '~/models/repositories/product.repository'
import { removeFieldNull, selectDataInfo, unSelectDataInfo, updateNestedUpdateParser } from '~/utils/convertData'

type ProductRegistry = { [key: string]: typeof Clothing | typeof Electronic }
export type ProductCreate = Omit<IProduct, '_id' | 'isPublished' | 'isDraft'> & { product_variations?: string[] }

export class ProductFactory {
  static productRegistry: ProductRegistry = {}

  static registerProduct(type: string, payload: typeof Clothing | typeof Electronic) {
    ProductFactory.productRegistry[type] = payload
  }

  static async createProductType(type: string, payload: ProductCreate) {
    const classRef = ProductFactory.productRegistry[type]
    if (!classRef) throw new BadRequestResponse({ message: 'Not found Type' })
    const newProduct = new classRef(payload)
    const productSaved = await newProduct.create()
    if (!productSaved) throw new BadRequestResponse({ message: 'Occur when create Product' })
    return {
      product: productSaved
    }
  }

  static async updateProductType(type: string, payload: Partial<ProductCreate>, product_id: string) {
    const classRef = ProductFactory.productRegistry[type]
    if (!classRef) throw new BadRequestResponse({ message: 'Not found Type' })
    const newProduct = new classRef(payload)
    const productUpdated = await newProduct.updateProduct(product_id)
    if (!productUpdated) throw new BadRequestResponse({ message: 'Occur when create Product' })
    return {
      product: productUpdated
    }
  }

  static async findProductDraft({ user_id, limit = 50, page = 0 }: { user_id: string; limit?: number; page?: number }) {
    const filter = { product_shop: user_id, isDraft: true }
    const result = await findProductIsDraft({ filter, limit, page })
    return {
      productList: result
    }
  }
  static async findProductPublished({ user_id, limit = 50, page = 0 }: { user_id: string; limit?: number; page?: number }) {
    const filter = { product_shop: user_id, isPublished: true }
    const result = await findProductIsDraft({ filter, limit, page })
    return {
      productList: result
    }
  }

  static async publishedProduct({ user_id, _id }: { user_id: string; _id: string }) {
    const filter = { product_shop: user_id, _id }
    const result = await publishedOneProduct(filter)
    if (!result) {
      throw new NotFoundResponse({ message: 'Error Product' })
    }
    return {
      isSuccess: Boolean(result)
    }
  }

  static async unPublishedProduct({ user_id, _id }: { user_id: string; _id: string }) {
    const filter = { product_shop: user_id, _id }
    const result = await unPublishedOneProduct(filter)
    if (!result) {
      throw new NotFoundResponse({ message: 'Error Product' })
    }
    return {
      isSuccess: Boolean(result)
    }
  }

  static async findByKeyword({ keyword }: { keyword: string }) {
    const foundProducts = await findByKeyword({ keyword })
    return foundProducts
  }

  static async findAllProducts({
    limit = 60,
    page = 1,
    sort,
    select = ['product_name', 'product_thumb', 'product_price'],
    filter = { isPublished: true }
  }: {
    limit?: number
    page?: number
    sort?: string
    select?: string[]
    filter?: Object
  }) {
    const sortBy: { [key: string]: SortOrder } = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const listProducts = await findAllProducts({
      limit,
      page,
      sort: sortBy,
      filter,
      select: selectDataInfo({ select })
    })
    return listProducts
  }

  static async findProduct({ unSelect = [], product_id }: { product_id: string; unSelect?: string[] }) {
    const product = await findProduct({
      product_id,
      unselect: unSelectDataInfo({ unSelect })
    })
    return product
  }
}

class Product {
  product: Partial<ProductCreate>

  constructor(productCreate: Partial<ProductCreate>) {
    this.product = productCreate
  }

  async createProduct(_id: Schema.Types.ObjectId) {
    const productCreated = await ProductModel.create({ ...this.product, _id })
    if (productCreated) {
      await createInventory({
        inven_productId: _id.toString(),
        inven_shopId: productCreated.product_shop.toString(),
        inven_stock: productCreated.product_quantity
      })
    }
    return productCreated
  }

  async updateProduct(_id: string, payload: Partial<ProductCreate>) {
    return await updateProductById({ _id, model: ProductModel, payload })
  }
}

export class Clothing extends Product {
  constructor(productCreate: Partial<ProductCreate>) {
    super(productCreate)
  }
  async create() {
    const newClothing = await ClothingModel.create({
      ...this.product.product_attributes,
      product_shop: this.product.product_shop
    })
    if (!newClothing) {
      throw new BadRequestResponse({ message: 'Error creating clothing' })
    }
    const newProduct = await super.createProduct(newClothing._id)
    if (!newProduct) throw new BadRequestResponse({ message: 'Error creating clothing product' })
    return newProduct // Nên trả về sản phẩm vừa tạo
  }

  async updateProduct(product_id: string) {
    const objParams = removeFieldNull(this.product)
    objParams.product_attributes = removeFieldNull(objParams.product_attributes)

    if (objParams.product_attributes) {
      await updateProductById({
        _id: product_id,
        model: ClothingModel,
        payload: removeFieldNull(objParams.product_attributes)
      })
    }
    const productUpdated = super.updateProduct(product_id, {
      ...updateNestedUpdateParser(this.product)
    })
    return productUpdated
  }
}

export class Electronic extends Product {
  constructor(productCreate: Partial<ProductCreate>) {
    super(productCreate)
  }
  async create() {
    const newElectronic = await ElectronicModel.create(this.product)
    if (!newElectronic) {
      throw new BadRequestResponse({ message: 'Error creating electronic' })
    }
    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) throw new BadRequestResponse({ message: 'Error creating electronic product' })
    return newProduct // Nên trả về sản phẩm vừa tạo
  }
  async updateProduct(product_id: string) {
    console.log('[1]>>', this.product)
    const objParams = removeFieldNull(this.product)
    console.log('[2]>>', objParams)

    if (objParams.product_attributes) {
      await updateProductById({ _id: product_id, model: ElectronicModel, payload: removeFieldNull(objParams.product_attributes) })
    }
    const productUpdated = super.updateProduct(product_id, updateNestedUpdateParser(this.product))
    return productUpdated
  }
}

export class FURNITURE extends Product {
  constructor(productCreate: Partial<ProductCreate>) {
    super(productCreate)
  }
  async create() {
    const newFurniture = await FurnitureModel.create(this.product)
    if (!newFurniture) {
      throw new BadRequestResponse({ message: 'Error creating electronic' })
    }
    const newProduct = await super.createProduct(newFurniture._id)
    if (!newProduct) throw new BadRequestResponse({ message: 'Error creating Furniture product' })
    return newProduct // Nên trả về sản phẩm vừa tạo
  }

  async updateProduct(product_id: string) {
    console.log('[1]>>', this.product)
    const objParams = removeFieldNull(this.product)
    console.log('[2]>>', objParams)

    if (objParams.product_attributes) {
      await updateProductById({ _id: product_id, model: FurnitureModel, payload: removeFieldNull(objParams.product_attributes) })
    }
    const productUpdated = super.updateProduct(product_id, updateNestedUpdateParser(this.product))
    return productUpdated
  }
}
