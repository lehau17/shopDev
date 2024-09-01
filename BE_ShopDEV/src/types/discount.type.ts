import { ObjectId } from 'mongoose'

export interface CreateDiscountRequestBody {
  discount_name: string
  discount_description: string
  discount_type?: string
  discount_value: number
  discount_code: string
  discount_start_date: string
  discount_end_date: string
  discount_max_uses: number
  discount_uses_count: number
  discount_max_uses_per_user?: number
  discount_min_order_value?: number
  discount_is_active?: boolean
  discount_applies_to: string
  discount_products_id?: string[]
}

export interface RemoveDiscountRequestBody {
  code: string
}
