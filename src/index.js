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
  const [data, setData] = useState([])
  const [path, setPath] = useState([]) // denotes root path
  const [paths, setPaths] = useState([])
  // react to initial sample change
  useEffect(() => {
    setData([])
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
      setData(getByPath(sample, path))
    } else if (Array.isArray(sample) && sample.length > 0) {
      setData(sample)
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
