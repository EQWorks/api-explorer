/* eslint-disable react/prop-types */
import React, { useState } from 'react' // no need to import `React` once 17

import { ThemeProvider } from '@eqworks/lumen-ui'
import { Table } from '@eqworks/lumen-table'

import { useSample } from '../src'
import SAMPLES from './data/samples'


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
        <div>
          <Table data={data} isBorder />
        </div>
      </div>
    </ThemeProvider>
  )
}

export const Raw = () => { // raw explorer
  const [sample, setSample] = useState({})
  const [sampleSize, setSampleSize] = useState(2)
  const {
    data,
    paths,
    path,
    setPath,
  } = useSample(sample)

  return (
    <div>
      <SampleControls sample={sample} setSample={setSample} paths={paths} path={path} setPath={setPath} />
      <div>
        <strong>
          Array Data Sample
          <label htmlFor="sampleSize">Sample Size:</label>
          <input name="sampleSize" type="number" value={sampleSize} onChange={({ target: { value } }) => setSampleSize(value)} />
        </strong>
        <pre>
          <code>{JSON.stringify((data || []).slice(0, sampleSize), null, 2)}</code>
        </pre>
      </div>
    </div>
  )
}
