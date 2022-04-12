/* eslint-disable react/prop-types */
import React, { useState } from 'react' // no need to import `React` once 17

import { Table } from '@eqworks/lumen-table'
import { DropdownSelect, Button, SwitchRect } from '@eqworks/lumen-labs'
import { ArrowDown } from '@eqworks/lumen-labs/dist/icons'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'ace-builds/src-noconflict/ext-language_tools'

import { useSample, utils } from '../src'
import SAMPLES from './data/samples'
import RawDisplay from './components/raw-display'
import LineChart from './components/line-chart'


export default { title: 'API Explorer/useSample' }

const SampleControls = ({ sample, setSample, paths, path, setPath, flatten, setFlatten }) => (
  <div>
    <div className='mb-3'>
      <AceEditor
        placeholder='Paste your sample JSON here'
        mode='json'
        theme='tomorrow'
        name='json-sample'
        onChange={(value) => { setSample(JSON.parse(value)) }}
        value={JSON.stringify(sample, null, 2)}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: false,
          tabSize: 2,
        }}
      />
    </div>
    <div className='flex flex-row'>
      <div className='mr-3'>
        <Button
          onClick={() => {
            const sample = Object.values(SAMPLES)[Math.floor(Math.random() * Object.values(SAMPLES).length)]
            setSample(sample)
          }}
          size='lg'
        >
          Random sample
        </Button>
      </div>
      <div className='mr-3'>
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
      <div>
        <SwitchRect
          id='flatten'
          label='Flatten'
          checked={flatten}
          onChange={({ target: { checked } }) => { setFlatten(checked) }}
        />
      </div>
    </div>
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
    flatten,
    setFlatten,
  } = useSample(sample)

  return (
    <div className='flex flex-row'>
      <div className='mr-3'>
        <SampleControls sample={sample} setSample={setSample} paths={paths} path={path} setPath={setPath} flatten={flatten} setFlatten={setFlatten} />
      </div>
      <div>
        {data && (<LineChart data={data} keys={keys} typedKeys={typedKeys} />)}
      </div>
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
    flatten,
    setFlatten,
  } = useSample(sample)

  return (
    <div className='flex flex-row'>
      <div className='mr-3'>
        <SampleControls sample={sample} setSample={setSample} paths={paths} path={path} setPath={setPath} flatten={flatten} setFlatten={setFlatten} />
      </div>
      <div>
        <Table data={data} isBorder />
      </div>
    </div>
  )
}

export const Raw = () => { // raw explorer
  const [sample, setSample] = useState({})
  const {
    data,
    paths,
    path,
    setPath,
    flatten,
    setFlatten,
  } = useSample(sample)

  return (
    <div className='flex flex-row'>
      <div className='mr-3'>
        <SampleControls sample={sample} setSample={setSample} paths={paths} path={path} setPath={setPath} flatten={flatten} setFlatten={setFlatten} />
      </div>
      <div>
        <RawDisplay data={data} />
      </div>
    </div>
  )
}

export const CustomKeyParsing = () => {
  const [sample, setSample] = useState({})
  const {
    data,
    paths,
    path,
    setPath,
    keys,
    typedKeys,
    flatten,
    setFlatten,
  } = useSample(sample, {
    buildKeys: (data) => {
      // build keys using all data rows
      if (!Array.isArray(data) || data.length === 0 || utils.isPrimitive(data[0])) {
        return []
      }
      // build common keys from all data rows
      return data
        .map((row) => Object.keys(row))
        .filter((keys) => keys.length > 0)
        .reduce((acc, keys) => keys.filter(Set.prototype.has, new Set(acc)))
    },
    buildTypedKeys: ({ keys, data }) => {
      const parsed = {}
      keys.filter((key) => utils.isPrimitive(data[0][key])).forEach((key) => {
        let type = typeof data[0][key]
        // special cases such as date/time to be parsed as strings
        if (['date', 'time', 'hour', 'year'].some((n) => key.toLowerCase().includes(n))) {
          type = 'string'
        }
        parsed[type] = parsed[type] || []
        parsed[type].push(key)
      })
      return parsed
    },
  })

  return (
    <div className='flex flex-row'>
      <div className='mr-3'>
        <SampleControls sample={sample} setSample={setSample} paths={paths} path={path} setPath={setPath} flatten={flatten} setFlatten={setFlatten} />
      </div>
      {data && (
        <div className='flex flex-row'>
          <div className='mr-3'>
            <strong>Data keys</strong>
            <pre>{JSON.stringify(keys, null, 2)}</pre>
          </div>
          <div>
            <strong>Typed data keys</strong>
            <pre>{JSON.stringify(typedKeys, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
