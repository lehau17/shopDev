import { ParamsDictionary } from 'express-serve-static-core'
import { Created, Ok } from '~/core/success.response'
import CommentService from '~/services/comment.service'
import { Request, Response } from 'express'
import { ICommentCreation } from '~/types/comment.type'
class CommentController {
  static async createComment(req: Request<ParamsDictionary, any, ICommentCreation>, res: Response) {
    new Created({ message: 'Comment created', metadata: await CommentService.createComment(req.body) }).send(res)
  }

  static async getComment(req: Request<ParamsDictionary, any, any, Record<string, string>>, res: Response) {
    const { parentId, productId } = req.query
    const limit = Number(req.query.limit) || 50
    const offset = Number(req.query.offset) || 0

    new Ok({
      message: 'Fetch comments',
      metadata: await CommentService.getCommentByParentIdAndProductId({
        parentId,
        productId,
        limit,
        offset
      })
    }).send(res)
  }

  static async deleteComment(req: Request, res: Response) {
    const { comment_id, product_id } = req.body
    new Ok({
      message: 'delete comments',
      metadata: await CommentService.deleteComment({ comment_id, product_id })
    }).send(res)
  }
}

export default CommentController
