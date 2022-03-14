/* eslint-disable react/prop-types */
import React, { useState } from 'react' // no need to import `React` once 17

import { ThemeProvider } from '@eqworks/lumen-ui'
import { Table } from '@eqworks/lumen-table'

import { useExplorer } from '../src'
import RawDisplay from './components/raw-display'
import LineChart from './components/line-chart'


export default { title: 'API Explorer/useExplorer' }

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
    <strong>Raw Response</strong>
    <pre>
      <code>{JSON.stringify(sample, null, 2)}</code>
    </pre>
  </div>
)

export const WithLineChart = () => {
  const [url, setURL] = useState('https://api.coinstats.app/public/v1/coins?skip=0&limit=5&currency=EUR')
  const {
    sample,
    data,
    paths,
    path,
    setPath,
    keys,
    typedKeys,
  } = useExplorer({ url })

  return (
    <div>
      <URLControls url={url} setURL={setURL} paths={paths} path={path} setPath={setPath} />
      <LineChart data={data} keys={keys} typedKeys={typedKeys} />
      <RawResponse sample={sample} />
    </div>
  )
}

export const WithTable = () => {
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
        <Table data={data} isBorder />
      </div>
      <RawResponse sample={sample} />
    </ThemeProvider>
  )
}

export const Raw = () => { // raw explorer
  const [url, setURL] = useState('https://api.covid19api.com/summary')
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
      <RawDisplay data={data} />
      <RawResponse sample={sample} />
    </div>
  )
}
