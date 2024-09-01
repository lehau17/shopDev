import { Clothing, Electronic, FURNITURE, ProductFactory } from '~/services/product.service'
import { ProductType } from '~/utils/enums'

export const configProductTypeRegiter = () => {
  ProductFactory.registerProduct(ProductType.CLOTHING, Clothing)
  ProductFactory.registerProduct(ProductType.ELECTRONICS, Electronic)
  ProductFactory.registerProduct(ProductType.FURNITURE, FURNITURE)
}
