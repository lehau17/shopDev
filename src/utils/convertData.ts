import mongoose from 'mongoose'

export const selectDataInfo = ({ select = [] }: { select: string[] }) => {
  if (select.length === 0) return {}
  const value = select.reduce(
    (acc, field) => {
      acc[field] = 1
      return acc
    },
    {} as Record<string, 1>
  )
  return value
}

export const unSelectDataInfo = ({ unSelect = [] }: { unSelect: string[] }) => {
  if (unSelect.length === 0) return {}
  const value = unSelect.reduce(
    (acc, field) => {
      acc[field] = -1
      return acc
    },
    {} as Record<string, -1>
  )
  return value
}

export const removeFieldNull = (obj: { [key: string]: any }) => {
  for (const key in obj) {
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key]
    }
  }
  return obj
}

/**
 * {
 *  a:{
 *     b:!
 *     v:1
 *  }
 * }
 */

export const updateNestedUpdateParser = (obj: { [key: string]: any }) => {
  const result: { [key: string]: any } = {}
  const keys = Object.keys(obj)
  keys.forEach((key) => {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const response = updateNestedUpdateParser(obj[key])
      Object.keys(response).forEach((a) => {
        result[`${key}.${a}`] = response[a]
      })
    } else {
      result[key] = obj[key]
    }
  })
  return result
}
//convert string to ObjectId
export const convertStringToObjectId = (str: string) => {
  return new mongoose.Types.ObjectId(str)
}
