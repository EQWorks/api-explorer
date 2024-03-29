/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react' // no need to import `React` once 17

import { PlotlyLineChart as Line } from '@eqworks/chart-system'
import { Button, DropdownSelect } from '@eqworks/lumen-labs'
import { ArrowDown } from '@eqworks/lumen-labs/dist/icons'


const LineChart = ({ data, typedKeys }) => {
  const [x, setX] = useState(null)
  const [ys, setYs] = useState([])
  useEffect(() => {
    setX((typedKeys.string || [])[0])
    setYs(typedKeys.number || [])
  }, [typedKeys])

  if (!data.length) {
    return null
  }

  const renderXYSelections = () => {
    const xOptions = typedKeys.string || []
    const yOptions = [...(typedKeys.number || []), ...(typedKeys.boolean || [])]

    return (
      <div>
        <p>Y-axes</p>
        {ys.length > 0 && (
          <Button size='sm' onClick={() => setYs([])}>
            unselect all
          </Button>
        )}
        <div className='mb-3'>
          <DropdownSelect
            simple
            multiSelect
            data={yOptions}
            endIcon={<ArrowDown size='md' />}
            placeholder='Select Y-axes'
            value={ys}
            onSelect={setYs}
            overflow='vertical'
            disabled={!xOptions.length}
          />
        </div>
        <p>X-axis</p>
        <div>
          <DropdownSelect
            simple
            data={xOptions}
            endIcon={<ArrowDown size='md' />}
            placeholder='Select an X-axis'
            value={x}
            onSelect={setX}
            disabled={!xOptions.length}
          />
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-row'>
      <div>
        {data && Object.keys(typedKeys).length > 0 && (renderXYSelections())}
      </div>
      {/* TODO: tailwind classes for w/h don't seem to work */}
      <div style={{ height: '75vh', width: '50vw' }}>
        <Line data={data} x={x} y={ys} />
      </div>
    </div>
  )
}

export default LineChart
