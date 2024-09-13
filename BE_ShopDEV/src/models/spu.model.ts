import mongoose, { ObjectId, Schema } from 'mongoose'
import slugify from 'slugify'
import { ProductType } from '~/utils/enums'

const DOCUMENT_NAME = 'Spu'
const COLLECTION_NAME = 'Spus'

export interface ISpu {
  _id: ObjectId
  spu_id: string
  spu_name: string
  spu_thumb: string
  spu_description: string
  spu_slug: string //le_trung_hau
  spu_price: number
  spu_category: string[]
  spu_quantity: number
  spu_shop: ObjectId
  spu_attributes: Object

  //bonus
  spu_rating_avg: number
  spu_variations: Object[]
  isDraft: boolean
  isPublished: boolean
  isDeleted: boolean
}

const spuSchema = new Schema<ISpu>(
  {
    spu_id: {
      type: String,
      default: ''
    },
    spu_name: {
      type: String,
      required: true
    },
    spu_thumb: {
      type: String,
      required: true
    },
    spu_description: {
      type: String,
      default: ''
    },
    spu_price: {
      type: Number,
      required: true
    },
    spu_category: {
      type: [String],
      default: []
    },
    spu_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true
    },
    spu_attributes: {
      type: Schema.Types.Mixed,
      required: true
    },
    spu_slug: {
      type: String
    },
    spu_rating_avg: {
      type: Number,
      default: 4.5,
      min: 1,
      set: (value: number) => Math.round(value * 10) / 10
    },
    spu_variations: {
      type: [Object],
      default: []
    },
    spu_quantity: {
      type: Number,
      default: 0
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false
    },
    isPublished: {
      type: Boolean,
      default: false,
      select: false
    },
    isDeleted: { type: Boolean, default: false, select: false }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

//index
spuSchema.index({ Spu_name: 'text', Spu_description: 'text' })

spuSchema.pre('save', function (next) {
  this.spu_slug = slugify(this.spu_name, { lower: true })
  next()
})

const SpuModel = mongoose.model(DOCUMENT_NAME, spuSchema)
export default SpuModel
