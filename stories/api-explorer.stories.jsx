import React, { useState } from 'react' // no need to import `React` once 17


import { useExplorer } from '../src'

const APIExplorer = () => {
  const [url] = useState('https://api.covid19api.com/summary')
  const {
    sample,
    // setSample,
    array,
    arrayPaths,
  } = useExplorer({ url })

  return (
    <div>
      <h1>
        Exploring: <a href={url}>{url}</a>
      </h1>
      <div>
        <h2>Array Paths</h2>
        <pre>
          <code>{JSON.stringify(arrayPaths, null, 2)}</code>
        </pre>
      </div>
      <div>
        <h2>Array Data</h2>
        <pre>
          <code>{JSON.stringify(array, null, 2)}</code>
        </pre>
      </div>
      <div>
        <h2>Raw Sample</h2>
        <pre>
          <code>{JSON.stringify(sample, null, 2)}</code>
        </pre>
      </div>
    </div>
  )
}

export default {
  title: 'API Explorer',
  component: APIExplorer,
}

export const Raw = () => <APIExplorer />
