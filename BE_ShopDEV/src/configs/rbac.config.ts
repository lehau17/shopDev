import { AccessControl } from 'accesscontrol'
import { getListRole } from '~/services/rbac.service'

const rbac = async () => {
  const rbac = new AccessControl(await getListRole())
  return rbac
}

export default rbac
