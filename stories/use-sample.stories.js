/* eslint-disable react/prop-types */
import React, { useState } from 'react' // no need to import `React` once 17

import { Table } from '@eqworks/lumen-table'
import { TextField, DropdownSelect, Button } from '@eqworks/lumen-labs'
import { ArrowDown } from '@eqworks/lumen-labs/dist/icons'

import { useSample } from '../src'
import SAMPLES from './data/samples'
import RawDisplay from './components/raw-display'
import LineChart from './components/line-chart'


export default { title: 'API Explorer/useSample' }

const SampleControls = ({ sample, setSample, paths, path, setPath }) => (
  <div>
    <div>
      <TextField.Area
        inputProps={{
          value: JSON.stringify(sample, null, 2),
          // onChange: value => setSample(JSON.parse(value)),
        }}
        label='JSON Sample'
        readOnly
      />
    </div>
    <div  className='flex flex-row mb-3'>
      <div className='mr-3'>
        <Button
          onClick={() => {
            const sample = Object.values(SAMPLES)[Math.floor(Math.random() * Object.values(SAMPLES).length)]
            console.log(sample)
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
    <div>
      <SampleControls sample={sample} setSample={setSample} paths={paths} path={path} setPath={setPath} />
      <Table data={data} isBorder />
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
    <div>
      <SampleControls sample={sample} setSample={setSample} paths={paths} path={path} setPath={setPath} />
      <RawDisplay data={data} />
    </div>
  )
}
