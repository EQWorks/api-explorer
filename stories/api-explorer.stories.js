/* eslint-disable react/prop-types */
import React, { useState } from 'react' // no need to import `React` once 17

import { ThemeProvider } from '@eqworks/lumen-ui'
import { Table } from '@eqworks/lumen-table'

import { useExplorer } from '../src'


export default { title: 'API Explorer' }

const URLControls = ({ url, setURL, paths, path, setPath }) => (
  <div>
    <label htmlFor="url">Explore:</label>
    <input name="url" type="text" value={url} onChange={({ target: { value } }) => setURL(value)} />
    &nbsp;
    {paths.length > 0 && (
      <>
        <label htmlFor="paths">Paths:</label>
        <select name="paths" value={path} onChange={({ target: { value } }) => setPath(value)}>
          {paths.map(path => (
            <option key={path.join('.')} value={path}>
              .{path.join('.')}
            </option>
          ))}
        </select>
      </>
    )}
  </div>
)

const RawResponse = ({ sample }) => (
  <div>
    <h2>Raw Response</h2>
    <pre>
      <code>{JSON.stringify(sample, null, 2)}</code>
    </pre>
  </div>
)

export const WithLumenTable = () => {
  const [url, setURL] = useState('https://api.covid19api.com/summary')
  const {
    sample,
    data,
    paths,
    path,
    setPath,
  } = useExplorer({ url })

  return (
    <ThemeProvider>
      <div>
        <URLControls url={url} setURL={setURL} paths={paths} path={path} setPath={setPath} />
        <div>
          <h2>Array Data Sample (Path: <code>.{path.join('.')}</code>)</h2>
          <Table data={data} isBorder />
        </div>
        <RawResponse sample={sample} />
      </div>
    </ThemeProvider>
  )
}

export const Raw = () => { // raw explorer
  const [url, setURL] = useState('https://api.covid19api.com/summary')
  const [sampleSize, setSampleSize] = useState(2)
  const {
    sample,
    data,
    paths,
    path,
    setPath,
  } = useExplorer({ url })

  return (
    <div>
      <URLControls url={url} setURL={setURL} paths={paths} path={path} setPath={setPath} />
      <div>
        <h2>Array Data Sample (Path: <code>.{path.join('.')}</code>)</h2>
        <div>
          <label htmlFor="sampleSize">Sample Size:</label>
          <input name="sampleSize" type="number" value={sampleSize} onChange={({ target: { value } }) => setSampleSize(value)} />
        </div>
        <pre>
          <code>{JSON.stringify((data || []).slice(0, sampleSize), null, 2)}</code>
        </pre>
      </div>
      <RawResponse sample={sample} />
    </div>
  )
}
