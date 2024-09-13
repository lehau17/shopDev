import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { Created, Ok } from '~/core/success.response'
import { createResource, createRole, getListResource, getListRole } from '~/services/rbac.service'
import { ResourceCreateRequestBody, RoleCreateRequestBody } from '~/types/rbac.type'

class RbacController {
  static async createResource(req: Request<ParamsDictionary, any, ResourceCreateRequestBody>, res: Response) {
    const { src_description, src_name, src_slug } = req.body
    new Created({ message: 'Resource created successfully', metadata: await createResource(src_name, src_slug, src_description) }).send(res)
  }

  static async createRole(req: Request<ParamsDictionary, any, RoleCreateRequestBody>, res: Response) {
    const { rol_name, rol_slug, rol_grants, rol_status } = req.body
    new Created({ message: 'Role created successfully', metadata: await createRole({ rol_name, rol_slug, rol_grants, rol_status }) }).send(
      res
    )
  }

  static async getResource(req: Request, res: Response) {
    new Ok({ message: 'Resource available', metadata: await getListResource() }).send(res)
  }

  static async getRole(req: Request, res: Response) {
    new Ok({ message: 'Role available', metadata: await getListRole() }).send(res)
  }
}

export default RbacController
