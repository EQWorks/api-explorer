/* eslint-disable react/prop-types */
import React, { useReducer, useState } from 'react' // no need to import `React` once 17

import { Table } from '@eqworks/lumen-table'
import { TextField, DropdownSelect, SwitchRect } from '@eqworks/lumen-labs'
import { ArrowDown } from '@eqworks/lumen-labs/dist/icons'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'ace-builds/src-noconflict/ext-language_tools'

import { useExplorer } from '../src'
import RawDisplay from './components/raw-display'
import LineChart from './components/line-chart'


export default { title: 'API Explorer/useExplorer' }

const URLControls = ({ url, setURL, paths, path, setPath, flatten, setFlatten, loading }) => (
  <div className='flex flex-row mb-3'>
    <div className='mr-3'>
      <TextField
        label='Explore API'
        value={url}
        onChange={setURL}
        size='lg'
        disabled={loading}
      />
    </div>
    <div className='mr-3'>
      <p>Paths</p> {/* hack to emulate label space */}
      <DropdownSelect
        simple
        data={paths}
        endIcon={<ArrowDown size='md' />}
        placeholder='Select a path'
        value={path}
        onSelect={setPath}
        size='lg'
        disabled={loading || paths.length <= 1}
      />
    </div>
    <div>
      <p>&nbsp;</p>
      <SwitchRect
        id='flatten'
        label='Flatten'
        checked={flatten}
        onChange={({ target: { checked } }) => { setFlatten(checked) }}
      />
    </div>
  </div>
)

const RawResponse = ({ sample }) => (
  <div>
    <AceEditor
      placeholder='Paste your sample JSON here'
      mode='json'
      theme='tomorrow'
      name='json-raw-response'
      readOnly
      value={JSON.stringify((sample || []), null, 2)}
      setOptions={{
        enableBasicAutocompletion: false,
        enableLiveAutocompletion: false,
        enableSnippets: false,
        showLineNumbers: false,
        tabSize: 2,
      }}
    />
  </div>
)

const ErrorResponse = ({ error }) => (
  <div>
    Error:
    <pre><code>{JSON.stringify(error.stack || error.message || String(error), null, 2)}</code></pre>
  </div>
)

const getDefaultOpts = () => ({
  headers: {
    'Accept': 'application/json',
  },
})

const fetchReducer = (state, action) => {
  if (action.type === 'url') {
    const url = action.payload
    let opts = getDefaultOpts()
    if (url?.includes('api.eqworks.io') || url?.includes('api.locus.place')) {
      const token = window.localStorage.getItem('eq-api-jwt')
      if (token) {
        opts = {
          ...state?.fetchOptions,
          headers: {
            ...state?.fetchOptions?.headers,
            'eq-api-jwt': token,
          },
        }
      }
    }
    return { ...state, url, fetchOptions: opts }
  }
  // other generic reducer actions
  return {
    ...state,
    [action.type]: action.payload,
  }
}

const useURL = (url = 'https://api.covid19api.com/summary') => {
  // using reducer here to ensure no leaky fetchOptions on url change
  const [explorerParams, dispatch] = useReducer(fetchReducer, {
    url,
    fetchOptions: getDefaultOpts(),
  })
  const setURL = (payload) => dispatch({ type: 'url', payload })
  return { setURL, explorerParams }
}

export const WithLineChart = () => {
  const { setURL, explorerParams } = useURL('https://api.coinstats.app/public/v1/coins?skip=0&limit=5&currency=EUR')
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
    flatten,
    setFlatten,
  } = useExplorer(explorerParams)

  const renderData = () => loading ? (
    <div>Loading...</div>
  ) : (
    <div className='flex flex-row'>
      <div className='mr-3'>
        <RawResponse sample={sample} />
      </div>
      <div>
        <LineChart data={data} keys={keys} typedKeys={typedKeys} />
      </div>
    </div>
  )

  return (
    <div>
      <URLControls url={explorerParams.url} setURL={setURL} paths={paths} path={path} setPath={setPath} flatten={flatten} setFlatten={setFlatten} loading={loading} />
      {error ? (<ErrorResponse error={error} />) : renderData()}
    </div>
  )
}

export const WithTable = () => {
  const { setURL, explorerParams} = useURL()
  const {
    sample,
    data,
    paths,
    path,
    setPath,
    loading,
    error,
    flatten,
    setFlatten,
  } = useExplorer(explorerParams)

  const renderData = () => loading ? (
    <div>Loading...</div>
  ) : (
    <div className='flex flex-row'>
      <div className='mr-3'>
        <RawResponse sample={sample} />
      </div>
      <div>
        <Table data={data} isBorder />
      </div>
    </div>
  )

  return (
    <div>
      <URLControls url={explorerParams.url} setURL={setURL} paths={paths} path={path} setPath={setPath} flatten={flatten} setFlatten={setFlatten} loading={loading} />
      {error ? (<ErrorResponse error={error} />) : renderData()}
    </div>
  )
}

export const Raw = () => { // raw explorer
  const { setURL, explorerParams} = useURL()
  const {
    sample,
    data,
    paths,
    path,
    setPath,
    loading,
    error,
    flatten,
    setFlatten,
  } = useExplorer(explorerParams)

  const renderData = () => loading ? (
    <div>Loading...</div>
  ) : (
    <div className='flex flex-row'>
      <div className='mr-3'>
        <RawResponse sample={sample} />
      </div>
      <div>
        <RawDisplay data={data} />
      </div>
    </div>
  )

  return (
    <div>
      <URLControls url={explorerParams.url} setURL={setURL} paths={paths} path={path} setPath={setPath} flatten={flatten} setFlatten={setFlatten} loading={loading} />
      {error ? (<ErrorResponse error={error} />) : renderData()}
    </div>
  )
}

export const Minimal = () => { // minimal explorer
  const [url, setURL] = useState('https://api.covid19api.com/summary')
  const {
    loading, // API is loading
    error, // API responds error
    sample, // API response sample
    data, // inferred tabular data (if any)
    paths, // inferred tabular data paths (if any)
    path, // selected tabular data path
    setPath, // setter for tabular data path
    flatten, // flatten nested Objects and Arrays
    setFlatten, // setter for flatten
    keys, // data row keys
    typedKeys, // data row keys with type information
  } = useExplorer({ url })

  const renderData = () => loading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <div>
        <strong>Data keys</strong>
        <pre>{JSON.stringify(keys)}</pre>
        <strong>Typed data keys</strong>
        <pre>{JSON.stringify(typedKeys)}</pre>
      </div>
      <div>
        <strong>Inferred tabular data at path <small>(.{path})</small></strong>
        <pre style={{ overflowY: 'scroll', height: '35vh' }}>{JSON.stringify(data, null, 2)}</pre>
      </div>
      <div>
        <strong>Raw response sample</strong>
        <pre style={{ overflowY: 'scroll', height: '35vh' }}>{JSON.stringify(sample, null, 2)}</pre>
      </div>
    </div>
  )

  return (
    <div>
      <div>
        <label>
          URL:&nbsp;
          <input
            value={url}
            onChange={(e) => setURL(e.target.value)}
            placeholder="URL"
            disabled={loading}
          />
        </label>
      </div>
      <div>
        <label>
          Tabular data path
          <select value={path} onChange={(e) => setPath(e.target.value)}>
            {paths.map((path) => (
              <option key={path} value={path}>{path}</option>
            ))}
          </select>
        </label>
        &nbsp;
        <label>
          <input
            type="checkbox"
            checked={flatten}
            onChange={(e) => setFlatten(e.target.checked)}
          />
          &nbsp;
          Flatten nested Objects and Arrays
        </label>
      </div>
      {error ? (
        <div>
          Error:
          <pre>{JSON.stringify(error.stack || error.message || String(error), null, 2)}</pre>
        </div>
      ) : renderData()}
    </div>
  )
}
