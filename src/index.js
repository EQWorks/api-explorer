import { useState, useEffect } from 'react'


const findArrayPaths = (obj) => {
  const paths = []
  const findPaths = (obj, path = []) => {
    if (Array.isArray(obj) && obj.length > 0) {
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

const getByPath = (obj, path) => path.reduce((acc, key) => acc[key], obj)

const isPrimitive = (value) => typeof value !== 'object'

const buildKeys = (data) => {
  if (!Array.isArray(data) || data.length === 0 || typeof data[0] !== 'object' || !data[0]) {
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

export const useSample = (sample) => {
  // set possible tabular (array) data paths, react to given sample
  const [paths, setPaths] = useState([])
  useEffect(() => {
    setData([])
    if (typeof sample === 'object' && sample !== null && !Array.isArray(sample)) {
      // search for non-empty Arrays in sample Object
      const paths = findArrayPaths(sample)
      setPaths(paths)
    } else {
      setPaths([])
    }
  }, [sample])
  // set initial tabular data path, react to paths change
  const [path, setPath] = useState([]) // default [] = root path
  useEffect(() => {
    if (paths && paths.length > 0) {
      // set first array path as default
      setPath(paths[0])
    } else {
      setPath([])
    }
  }, [paths])
  // find tabular data, react to path or sample change
  const [data, setData] = useState([])
  useEffect(() => {
    if (path && path.length > 0 && sample) {
      setData(getByPath(sample, path))
    } else if (Array.isArray(sample) && sample.length > 0) {
      setData(sample)
    }
  }, [path, sample]) // in theory this reacts only to path change, while sample shouldn't change
  // find data keys, react to data change
  const [keys, setKeys] = useState([])
  useEffect(() => {
    try {
      setKeys(buildKeys(data))
    } catch(e) {
      // TODO: handle error
      setKeys([])
    }
  }, [data])
  // set parsed keys by inferred value type, react to keys or data change
  const [typedKeys, setTypedKeys] = useState({})
  useEffect(() => {
    if (keys && keys.length > 0 && data && data.length > 0) {
      const parseKeys = {}
      keys.forEach(key => {
        const type = typeof data[0][key]
        parseKeys[type] = parseKeys[type] || []
        parseKeys[type].push(key)
      })
      setTypedKeys(parseKeys)
    } else {
      setTypedKeys({})
    }
  }, [keys, data])

  return {
    sample,
    data,
    paths,
    path,
    setPath,
    keys, // raw data keys
    typedKeys, // parsed keys by inferred value types
  }
}

// TODO: detect and support other content types
const request = (...fetchParams) => fetch(...fetchParams).then(res => res.json())

export const useExplorer = ({ url, fetchOptions }) => {
  // fetch sample data from given API endpoint
  const [sample, setSample] = useState(null)
  useEffect(() => {
    if (url) {
      // TODO: handle errors
      request(url, fetchOptions).then(setSample)
    }
  }, [url, fetchOptions])

  return useSample(sample)
}

export default useExplorer
