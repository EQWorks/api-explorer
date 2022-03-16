/* eslint-disable react/prop-types */
import React, { useState } from 'react' // no need to import `React` once 17

import { Table } from '@eqworks/lumen-table'
import { TextField, DropdownSelect } from '@eqworks/lumen-labs'
import { ArrowDown } from '@eqworks/lumen-labs/dist/icons'

import { useExplorer } from '../src'
import RawDisplay from './components/raw-display'
import LineChart from './components/line-chart'


export default { title: 'API Explorer/useExplorer' }

const URLControls = ({ url, setURL, paths, path, setPath }) => (
  <div className='flex flex-row mb-3'>
    <div className='mr-3'>
      <TextField
        label='Explore API'
        value={url}
        onChange={setURL}
        size='lg'
      />
    </div>
    <div>
      <p>Paths</p> {/* hack to emulate label space */}
      <DropdownSelect
        simple
        data={paths}
        endIcon={<ArrowDown size='md' />}
        placeholder='Select a path'
        value={path}
        onSelect={setPath}
        size='lg'
        disabled={paths.length <= 1}
      />
    </div>
  </div>
)

const RawResponse = ({ sample }) => (
  <TextField.Area
    inputProps={{ value: JSON.stringify(sample, null, 2) }}
    label='Raw Response'
    readOnly
  />
)

const ErrorResponse = ({ error }) => (
  <div>
    Error:
    <pre><code>{JSON.stringify(error.stack || error.message || String(error), null, 2)}</code></pre>
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
    loading,
    error,
  } = useExplorer({ url })

  const renderData = () => loading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <div>
        <LineChart data={data} keys={keys} typedKeys={typedKeys} />
      </div>
      <div>
        <RawResponse sample={sample} />
      </div>
    </div>
  )

  return (
    <div>
      <URLControls url={url} setURL={setURL} paths={paths} path={path} setPath={setPath} />
      {error ? (<ErrorResponse error={error} />) : renderData()}
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
    loading,
    error,
  } = useExplorer({ url })

  const renderData = () => loading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <div>
        <Table data={data} isBorder />
      </div>
      <div>
        <RawResponse sample={sample} />
      </div>
    </div>
  )

  return (
    <div>
      <URLControls url={url} setURL={setURL} paths={paths} path={path} setPath={setPath} />
      {error ? (<ErrorResponse error={error} />) : renderData()}
    </div>
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
    loading,
    error,
  } = useExplorer({ url })

  const renderData = () => loading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <div>
        <RawDisplay data={data} />
      </div>
      <div>
        <RawResponse sample={sample} />
      </div>
    </div>
  )

  return (
    <div>
      <URLControls url={url} setURL={setURL} paths={paths} path={path} setPath={setPath} />
      {error ? (<ErrorResponse error={error} />) : renderData()}
    </div>
  )
}
