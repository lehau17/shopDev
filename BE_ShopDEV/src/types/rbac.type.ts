export interface ResourceCreateRequestBody {
  src_name: string
  src_slug: string
  src_description: string
}

export interface RoleCreateRequestBody {
  rol_name: string
  rol_slug: string
  rol_status?: string
  rol_grants?: {
    resource: string
    actions: string[]
    attributes: string
  }[]
}
