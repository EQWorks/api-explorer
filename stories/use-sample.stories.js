/* eslint-disable react/prop-types */
import React, { useState } from 'react' // no need to import `React` once 17

import { ThemeProvider } from '@eqworks/lumen-ui'
import { Table } from '@eqworks/lumen-table'

import { useSample } from '../src'
import SAMPLES from './data/samples'
import RawDisplay from './components/raw-display'
import LineChart from './components/line-chart'


export default { title: 'API Explorer/useSample' }

const SampleControls = ({ sample, setSample, paths, path, setPath }) => (
  <div>
    <textarea name="sample" value={JSON.stringify(sample, null, 2)} onChange={({ target: { value } }) => setSample(JSON.parse(value))} />
    &nbsp;
    <button
      onClick={() => {
        const sample = Object.values(SAMPLES)[Math.floor(Math.random() * Object.values(SAMPLES).length)]
        console.log(sample)
        setSample(sample)
      }}
    >
      Load random sample
    </button>
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

export const WithLineChart = () => {
  const [sample, setSample] = useState({})
  const {
    data,
    paths,
    path,
    setPath,
    keys,
    typedKeys,
  } = useSample(sample)

  return (
    <div>
      <SampleControls sample={sample} setSample={setSample} paths={paths} path={path} setPath={setPath} />
      <LineChart data={data} keys={keys} typedKeys={typedKeys} />
    </div>
  )
}

export const WithTable = () => {
  const [sample, setSample] = useState({})
  const {
    data,
    paths,
    path,
    setPath,
  } = useSample(sample)

  return (
    <ThemeProvider>
      <div>
        <SampleControls sample={sample} setSample={setSample} paths={paths} path={path} setPath={setPath} />
        <Table data={data} isBorder />
      </div>
    </ThemeProvider>
  )
}

export const Raw = () => { // raw explorer
  const [sample, setSample] = useState({})
  const {
    data,
    paths,
    path,
    setPath,
  } = useSample(sample)

  return (
    <div>
      <SampleControls sample={sample} setSample={setSample} paths={paths} path={path} setPath={setPath} />
      <RawDisplay data={data} />
    </div>
  )
}
