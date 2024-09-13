import mongoose, { ObjectId, Schema } from 'mongoose'

const DOCUMENT_NAME = 'Template'
const COLLECTION_NAME = 'Templates'
export interface ITemplate {
  _id: ObjectId
  tem_name: string
  tem_html: string
  tem_description: string
}

const templateSchema = new Schema<ITemplate>(
  {
    tem_name: { type: 'string', required: true },
    tem_html: { type: 'string', required: true },
    tem_description: { type: 'string', default: '' }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)
const TemplateModel = mongoose.model(DOCUMENT_NAME, templateSchema)
export default TemplateModel
