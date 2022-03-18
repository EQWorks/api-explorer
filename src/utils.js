export const isPrimitive = (value) => typeof value !== 'object'

export const findArrayPaths = (obj) => {
  const paths = []
  const findPaths = (obj, path = []) => {
    if (Array.isArray(obj) && obj.length) {
      paths.push(path)
    } else if (typeof obj === 'object') {
      for (const key in obj) {
        findPaths(obj[key], [...path, key])
      }
    }
  }
  findPaths(obj)
  return paths
}

export const getByPath = (obj, path) => path.reduce((acc, key) => acc[key], obj)

export const buildKeys = (data) => {
  if (!Array.isArray(data) || data.length === 0 || isPrimitive(data[0]) || !data[0]) {
    return []
  }
  const keys = []
  Object.entries((data[0] || {})).forEach(([key, value]) => {
    if (isPrimitive(value)) {
      keys.push(key)
    }
  })
  return keys
}

// flatten nested objects and arrays as dot-separated root keys
export const flattenAsDot = (obj) => {
  const flattened = {}
  const flatten = (obj, path = []) => {
    if (isPrimitive(obj) || !obj) {
      flattened[path.join('.')] = obj
    } else {
      Object.entries(obj).forEach(([key, value]) => {
        flatten(value, [...path, key])
      })
    }
  }
  flatten(obj)
  return flattened
}
