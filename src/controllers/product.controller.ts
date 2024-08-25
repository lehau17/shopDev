import { BadRequestResponse } from '~/core/error.response'
import { Request, Response } from 'express'
import { Ok } from '~/core/success.response'
import { ProductFactory } from '~/services/product.service'
import { ITokenPayload } from '~/types/TokenPayload'
import core from 'express-serve-static-core'
class ProductController {
  static async createProduct(req: Request, res: Response) {
    const { userId } = req.decodeAccessToken as ITokenPayload
    const productCreatePayload = req.body
    new Ok({
      message: 'Product created successfully',
      metadata: await ProductFactory.createProductType(productCreatePayload.product_type, {
        ...productCreatePayload,
        product_shop: userId
      })
    }).send(res)
  }

  static async updateProduct(req: Request, res: Response) {
    const id = req.params.id
    const productPayload = req.body
    new Ok({
      message: 'Product updated successfully',
      metadata: await ProductFactory.updateProductType(productPayload.product_type, productPayload, id)
    }).send(res)
  }

  static async getProductDraft(req: Request, res: Response) {
    const { limit, page } = req.params
    const { userId } = req.decodeAccessToken as ITokenPayload

    new Ok({
      message: 'Get all Product draft by id',
      metadata: await ProductFactory.findProductDraft({
        user_id: userId,
        limit: Number(limit),
        page: Number(page)
      })
    }).send(res)
  }

  static async getProductPublished(req: Request, res: Response) {
    const { limit, page } = req.query
    const { userId } = req.decodeAccessToken as ITokenPayload

    new Ok({
      message: 'Get all Product draft by id',
      metadata: await ProductFactory.findProductPublished({
        user_id: userId,
        limit: Number(limit),
        page: Number(page)
      })
    }).send(res)
  }

  static async publishedOneProduct(req: Request, res: Response) {
    const id = req.params.id
    if (!id) {
      throw new BadRequestResponse({ message: 'Invalid request' })
    }
    const { userId } = req.decodeAccessToken as ITokenPayload

    new Ok({
      message: 'Published Product',
      metadata: await ProductFactory.publishedProduct({
        _id: id,
        user_id: userId
      })
    }).send(res)
  }

  static async unPublishedOneProduct(req: Request, res: Response) {
    const id = req.params.id
    if (!id) {
      throw new BadRequestResponse({ message: 'Invalid request' })
    }
    const { userId } = req.decodeAccessToken as ITokenPayload

    new Ok({
      message: 'unPublished Product',
      metadata: await ProductFactory.unPublishedProduct({
        _id: id,
        user_id: userId
      })
    }).send(res)
  }

  static async findAllProduct(req: Request<core.ParamsDictionary, any, any, { [key: string]: string | undefined }>, res: Response) {
    const { limit, page, sort, ...filter } = req.query
    new Ok({
      message: 'fetch all Product',
      metadata: await ProductFactory.findAllProducts({ limit: Number(limit), page: Number(page), sort, ...filter })
    }).send(res)
  }

  static async findProduct(req: Request, res: Response) {
    const id = req.params.id as string
    if (!id) {
      throw new BadRequestResponse({ message: 'Invalid request' })
    }

    new Ok({
      message: 'fetch Product',
      metadata: await ProductFactory.findProduct({ product_id: id })
    }).send(res)
  }
}

export default ProductController
