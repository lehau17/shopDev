import { Schema } from 'mongoose'
import { BadRequestResponse, NotFoundResponse } from '~/core/error.response'
import ClothingModel from '~/models/Clothing.model'
import ElectronicModel from '~/models/Electronic.model'
import FurnitureModel from '~/models/furniture.model'
import ProductModel, { IProduct } from '~/models/Product.model'
import { findProductIsDraft, publishedOneProduct } from '~/models/repositories/product.repository'
import { ProductType } from '~/utils/enums'

type ProductRegistry = { [key: string]: typeof Clothing | typeof Electronic }
export type ProductCreate = Omit<IProduct, '_id' | 'isPublished' | 'isDraft'> & { product_variations?: string[] }

export class ProductFactory {
  static productRegistry: ProductRegistry = {}

  static registerProduct(type: string, payload: typeof Clothing | typeof Electronic) {
    ProductFactory.productRegistry[type] = payload
  }

  static async createProductType(type: string, payload: ProductCreate) {
    console.log('Check type>>>', type)
    const classRef = ProductFactory.productRegistry[type]
    if (!classRef) throw new BadRequestResponse({ message: 'Not found Type' })
    const newProduct = new classRef(payload)
    const productSaved = await newProduct.create()
    if (!productSaved) throw new BadRequestResponse({ message: 'Occur when create Product' })
    return {
      product: productSaved
    }
  }

  static async findProductDraft({ user_id, limit = 50, page = 0 }: { user_id: string; limit?: number; page?: number }) {
    const filter = { product_shop: user_id, isDraft: true }
    const result = await findProductIsDraft({ filter, limit, page })
    return {
      productList: result
    }
  }
  static async findProductPublished({
    user_id,
    limit = 50,
    page = 0
  }: {
    user_id: string
    limit?: number
    page?: number
  }) {
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
}

class Product {
  product: ProductCreate

  constructor(productCreate: ProductCreate) {
    this.product = productCreate
  }

  async createProduct(_id: Schema.Types.ObjectId) {
    return await ProductModel.create({ ...this.product, _id })
  }
}

export class Clothing extends Product {
  constructor(productCreate: ProductCreate) {
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
}

export class Electronic extends Product {
  async create() {
    const newElectronic = await ElectronicModel.create(this.product)
    if (!newElectronic) {
      throw new BadRequestResponse({ message: 'Error creating electronic' })
    }
    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) throw new BadRequestResponse({ message: 'Error creating electronic product' })
    return newProduct // Nên trả về sản phẩm vừa tạo
  }
}

export class FURNITURE extends Product {
  async create() {
    const newFurniture = await FurnitureModel.create(this.product)
    if (!newFurniture) {
      throw new BadRequestResponse({ message: 'Error creating electronic' })
    }
    const newProduct = await super.createProduct(newFurniture._id)
    if (!newProduct) throw new BadRequestResponse({ message: 'Error creating Furniture product' })
    return newProduct // Nên trả về sản phẩm vừa tạo
  }
}
