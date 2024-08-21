import { BadRequestResponse } from '~/core/error.response'
import { publishedOneProduct } from './../models/repositories/product.repository'
import { Request, Response } from 'express'
import { Ok } from '~/core/success.response'
import { ProductFactory } from '~/services/product.service'
import { ITokenPayload } from '~/types/TokenPayload'
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
}

export default ProductController
