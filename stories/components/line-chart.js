/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react' // no need to import `React` once 17

import { PlotlyLineChart as Line } from '@eqworks/chart-system'
import { DropdownSelect } from '@eqworks/lumen-labs'
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

    if (!xOptions.length || !yOptions.length) {
      return null
    }

    return (
      <div>
        <p>Y-axes</p>
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
      <div style={{ height: '85vh' }} className='grow'>
        <Line data={data} x={x} y={ys} />
      </div>
    </div>
  )
}

export default LineChart
