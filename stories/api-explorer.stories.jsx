import React, { useState } from 'react' // no need to import `React` once 17


import { useExplorer } from '../src'

const APIExplorer = () => {
  const [url] = useState('https://api.covid19api.com/summary')
  const {
    sample,
    // setSample,
    // array,
    // arrayPaths,
  } = useExplorer({ url })

  return (
    <div>
      <pre>
        <code>{JSON.stringify(sample, null, 2)}</code>
      </pre>
    </div>
  )
}

export default {
  title: 'API Explorer',
  component: APIExplorer,
}

export const Empty = () => <APIExplorer />
