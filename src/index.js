import { useState, useEffect } from 'react'

import {
  isPrimitive,
  findArrayPaths,
  getByPath,
  buildKeys,
  flattenAsDot,
} from './utils'

// TODO: dissect this hook into keys, data (and paths) aspects?
export const useSample = (sample) => {
  // set possible tabular (array) data paths, react to given sample
  const [data, setData] = useState([])
  const [paths, setPaths] = useState([])
  useEffect(() => {
    setData([])
    if (typeof sample === 'object' && sample !== null && !Array.isArray(sample)) {
      // search for nonempty Arrays in sample Object
      setPaths(findArrayPaths(sample))
    } else {
      setPaths([])
    }
  }, [sample])
  // set initial tabular data path, react to paths change
  const [path, setPath] = useState([]) // default [] = root path
  useEffect(() => {
    // set first array path as default
    setPath(paths?.length ? paths[0] : [])
  }, [paths])
  // find tabular data, react to path, sample, or flatten change
  const [flatten, setFlatten] = useState(false)
  useEffect(() => {
    let data = []
    if (Array.isArray(sample) && sample.length) { // sample is an array
      data = sample
    } else if (path?.length && sample && !isPrimitive(sample)) { // sample is an object
      data = getByPath(sample, path) || []
    }
    setData(flatten ? data.map(flattenAsDot) : data)
  }, [path, sample, flatten]) // in theory this reacts only to path change, while sample shouldn't change
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
    if (keys?.length && data?.length) {
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
    flatten,
    setFlatten,
  }
}

const request = (...fetchParams) => fetch(...fetchParams).then(res => res.json())

export const useExplorer = ({ url, fetchOptions }) => {
  // fetch sample data from given API endpoint
  const [sample, setSample] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  useEffect(() => {
    if (url) {
      // TODO: handle errors
      setLoading(true)
      setError(null)
      setSample(null)
      request(url, fetchOptions)
        .then(setSample)
        .catch(setError)
        .finally(() => setLoading(false))
    }
  }, [url, fetchOptions])

  return {
    ...useSample(sample),
    loading,
    error,
  }
}

export default useExplorer
