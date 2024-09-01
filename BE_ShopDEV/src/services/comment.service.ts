import { BadRequestResponse, NotFoundResponse } from '~/core/error.response'
import CommentModel from '~/models/comment.model'
import { findProductById } from '~/models/repositories/product.repository'
import { ICommentCreation } from '~/types/comment.type'
import { convertStringToObjectId } from '~/utils/convertData'

class CommentService {
  static async createComment(body: ICommentCreation) {
    let { comment_parentId, comment_productId } = body
    const comment = new CommentModel(body)
    let rightValue = 0
    if (comment_parentId) {
      //reply comment
      const foundCommentParent = await CommentModel.findById(comment_parentId)
      if (!foundCommentParent) throw new BadRequestResponse({ message: 'Comment not found' })
      rightValue = foundCommentParent.comment_right
      await CommentModel.updateMany(
        {
          comment_productId: comment_productId,
          comment_right: { $gte: rightValue }
        },
        {
          $inc: {
            comment_right: 2
          }
        }
      )
      await CommentModel.updateMany(
        {
          comment_productId: comment_productId,
          comment_left: { $gte: rightValue }
        },
        {
          $inc: {
            comment_left: 2
          }
        }
      )
    } else {
      //find maxRight
      const maxRightValue = await CommentModel.findOne({ comment_productId: comment_productId }, 'comment_right', {
        $sort: { comment_right: -1 }
      })
      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1
      } else {
        rightValue = 1
      }
    }
    comment.comment_left = rightValue
    comment.comment_right = rightValue + 1
    return await comment.save()
  }

  static async getCommentByParentIdAndProductId({
    parentId,
    productId,
    limit = 60,
    offset = 0
  }: {
    parentId?: string
    productId: string
    limit?: number
    offset?: number
  }) {
    if (parentId) {
      const foundComment = await CommentModel.findById(convertStringToObjectId(parentId))
      if (!foundComment) throw new NotFoundResponse({ message: 'Comment not found' })

      return CommentModel.find({
        comment_parentId: foundComment._id,
        comment_productId: convertStringToObjectId(productId),
        comment_left: { $gt: foundComment.comment_left },
        comment_right: { $lte: foundComment.comment_right }
      })
        .skip(offset)
        .limit(limit)
    } else {
      return CommentModel.find({
        comment_parentId: null,
        comment_productId: convertStringToObjectId(productId)
      })
        .skip(offset)
        .limit(limit)
    }
  }

  static async deleteComment({ comment_id, product_id }: { comment_id: string; product_id: string }) {
    const foundProduct = await findProductById(product_id)
    if (!foundProduct) throw new NotFoundResponse({ message: 'Product not found' })
    const foundComment = await CommentModel.findById(comment_id)
    if (!foundComment) throw new NotFoundResponse({ message: 'comment not found' })
    const leftValue = foundComment.comment_left
    const rightValue = foundComment.comment_right
    const width = rightValue - leftValue
    //delete all nested comments
    await CommentModel.deleteMany({
      comment_productId: convertStringToObjectId(product_id),
      comment_left: { $gte: leftValue, $lt: rightValue }
    })
    // updated comment
    // desc node right
    await CommentModel.updateMany(
      {
        comment_productId: convertStringToObjectId(product_id),
        comment_right: { $gt: rightValue }
      },
      { $inc: { $comment_right: width * -1 } }
    )
    //desc node left
    await CommentModel.updateMany(
      {
        comment_productId: convertStringToObjectId(product_id),
        comment_left: { $gt: rightValue }
      },
      { $inc: { $comment_left: -width * -1 } }
    )
    return true
  }
}

export default CommentService
