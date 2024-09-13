import { ObjectId } from 'mongoose'
import { ConfigResponse } from '~/core/error.response'
import ResourceModel from '~/models/resource.model'
import RoleModel from '~/models/role.model'

export const createResource = async (src_name: string, src_slug: string, src_description: string) => {
  // check exist name and slug
  const foundResource = await ResourceModel.findOne({ $or: [{ src_name: src_name }, { src_slug: src_slug }] })
  if (foundResource) {
    throw new ConfigResponse({ message: 'Resource already exists' })
  }
  //create resource
  return await ResourceModel.create({ src_name, src_slug, src_description })
}
export const getListResource = async () => {
  return ResourceModel.find().lean()
}

export const createRole = async ({
  rol_name,
  rol_slug,
  rol_grants = [],
  rol_status = 'active'
}: {
  rol_name: string
  rol_slug: string
  rol_status?: string
  rol_grants?: {
    resource: string
    actions: string[]
    attributes: string
  }[]
}) => {
  // check exist name and slug
  const foundRole = await ResourceModel.findOne({ $or: [{ rol_name: rol_name }, { rol_slug: rol_slug }] })
  if (foundRole) {
    throw new ConfigResponse({ message: 'Role already exists' })
  }
  //create role
  return await RoleModel.create({ rol_name, rol_slug, rol_grants, rol_status })
}
export const getListRole = async () => {
  return RoleModel.aggregate([
    { $unwind: '$rol_grants' },
    { $lookup: { from: 'Resources', localField: 'rol_grants.resource', foreignField: '_id', as: 'resource' } },
    { $unwind: '$rol_grants.actions' },
    {
      $project: {
        role: '$rol_name',
        resource: '$resource.src_name',
        action: '$rol_grants.actions',
        attributes: '$rol_grants.attributes',
        _id: 0
      }
    },
    { $unwind: '$resource' }
  ])
}
