import _ from 'lodash'

export const getInfoData = (fields: string[], obj: Object) => {
  return _.pick(Object, fields)
}

export const randomId = () => {
  return Math.floor(Math.random() * 890000 * 100000).toString()
}
