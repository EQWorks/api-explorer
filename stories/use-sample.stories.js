/* eslint-disable react/prop-types */
import React, { useState } from 'react' // no need to import `React` once 17

import { Table } from '@eqworks/lumen-table'
import { DropdownSelect, Button } from '@eqworks/lumen-labs'
import { ArrowDown } from '@eqworks/lumen-labs/dist/icons'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'ace-builds/src-noconflict/ext-language_tools'

import { useSample } from '../src'
import SAMPLES from './data/samples'
import RawDisplay from './components/raw-display'
import LineChart from './components/line-chart'


export default { title: 'API Explorer/useSample' }

const SampleControls = ({ sample, setSample, paths, path, setPath }) => (
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
          Load random sample
        </Button>
      </div>
      <div>
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
    <div className='flex flex-row'>
      <div className='mr-3'>
        <SampleControls sample={sample} setSample={setSample} paths={paths} path={path} setPath={setPath} />
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
  } = useSample(sample)

  return (
    <div className='flex flex-row'>
      <div className='mr-3'>
        <SampleControls sample={sample} setSample={setSample} paths={paths} path={path} setPath={setPath} />
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
  } = useSample(sample)

  return (
    <div className='flex flex-row'>
      <div className='mr-3'>
        <SampleControls sample={sample} setSample={setSample} paths={paths} path={path} setPath={setPath} />
      </div>
      <div>
        <RawDisplay data={data} />
      </div>
    </div>
  )
}
