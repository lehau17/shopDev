import CartModel from '../cart.model'

export const findCartById = (id: string) => CartModel.findById(id)
