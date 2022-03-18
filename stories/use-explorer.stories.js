/* eslint-disable react/prop-types */
import React, { useReducer } from 'react' // no need to import `React` once 17

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
