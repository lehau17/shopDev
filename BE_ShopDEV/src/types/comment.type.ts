export interface ICommentCreation {
  comment_productId: string
  comment_content: string
  comment_userId: string
  comment_parentId?: string
  comment_left?: number
  comment_right?: number
}
