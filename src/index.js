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

export const useSample = (sample) => {
  // infer output from retrieved sample
  const [data, setArray] = useState([])
  const [path, setPath] = useState([]) // denotes root path
  const [paths, setPaths] = useState([])
  // react to initial sample change
  useEffect(() => {
    setArray([])
    if (typeof sample === 'object' && sample !== null && !Array.isArray(sample)) {
      // search for Arrays in sample Object
      const paths = findArrayPaths(sample)
      setPaths(paths)
    } else {
      setPaths([])
    }
  }, [sample])
  // react to paths change
  useEffect(() => {
    if (paths && paths.length > 0) {
      // set first array path as default
      setPath(paths[0])
    } else {
      setPath([])
    }
  }, [paths])
  // react to path or sample change
  useEffect(() => {
    if (path && path.length > 0 && sample) {
      setArray(getByPath(sample, path))
    } else if (Array.isArray(sample) && sample.length > 0) {
      setArray(sample)
    }
  }, [path, sample]) // in theory this reacts only to path change, while sample shouldn't change

  return {
    sample,
    data,
    paths,
    path,
    setPath,
  }
}

const request = async (...fetchParams) => {
  const response = await fetch(...fetchParams)
  const data = await response.json() // TODO: detect and support other content types
  return data
}

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
