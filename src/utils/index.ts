import _ from 'lodash'

export const getInfoData = (fields: string[], obj: Object) => {
  return _.pick(Object, fields)
}
