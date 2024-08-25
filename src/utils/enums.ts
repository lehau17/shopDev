export enum StatusShop {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export enum ApiKeyPermissions {
  '0001' = '0001',
  '0002' = '0002',
  '0000' = '0000'
}

export enum ProductType {
  ELECTRONICS = 'Electronics',
  CLOTHING = 'Clothing',
  FURNITURE = 'Furniture'
}

export enum DiscountType {
  FIXED_AMOUNT = 'fixed_amount',
  PERCENTAGE = 'percentage'
}

export enum DiscountApplyTo {
  ALL = 'all',
  SPECIFIC = 'specific'
}

export enum CartState {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PENDING = 'pending'
}
