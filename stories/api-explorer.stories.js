import React, { useState } from 'react' // no need to import `React` once 17

import { useExplorer } from '../src'


export default { title: 'API Explorer' }

export const Raw = () => { // raw explorer
  const [url, setURL] = useState('https://api.covid19api.com/summary')
  const {
    sample,
    data,
    paths,
    path,
    // setPath,
  } = useExplorer({ url })

  return (
    <div>
      <p>
        Explore:
        <input type="text" value={url} onChange={({ target: { value } }) => setURL(value)} />
      </p>
      <div>
        <h2>Array Data Paths</h2>
        <pre>
          Paths:
          <code>{JSON.stringify(paths, null, 2)}</code>
        </pre>
      </div>
      <div>
        <h2>Array Data (Path: <code>.{path.join('.')}</code>)</h2>
        <pre>
          <code>{JSON.stringify(data, null, 2)}</code>
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
