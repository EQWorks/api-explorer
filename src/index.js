import { useState, useEffect } from 'react'


const request = async (...fetchParams) => {
  const response = await fetch(...fetchParams)
  const data = await response.json() // TODO: detect and support other content types
  return data
}

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

export const useExplorer = ({ url, fetchOptions }) => {
  // fetch sample data from given API endpoint
  const [sample, setSample] = useState(null)
  useEffect(() => {
    if (url) {
      // TODO: handle errors
      request(url, fetchOptions).then(setSample)
    }
  }, [url, fetchOptions])

  // infer output from retrieved sample
  const [data, setArray] = useState([])
  const [path, setPath] = useState([])
  const [paths, setPaths] = useState([])
  useEffect(() => {
    if (Array.isArray(sample) && sample.length > 0) {
      setArray(sample)
    } else if (typeof sample === 'object' && sample !== null) {
      // search for Arrays in sample Object
      const paths = findArrayPaths(sample)
      setPaths(paths)
    } else {
      setArray([])
    }
  }, [sample])
  // react to paths change
  useEffect(() => {
    if (paths && paths.length > 0) {
      // set first array path as default
      setPath(paths[0])
    }
  }, [paths])
  // react to path or sample change
  useEffect(() => {
    if (path && sample) {
      setArray(getByPath(sample, path))
    }
  }, [path, sample])

  return {
    sample,
    data,
    paths,
    path,
    setPath,
  }
}

export default useExplorer
