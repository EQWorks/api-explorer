/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react' // no need to import `React` once 17

import { PlotlyLineChart as Line } from '@eqworks/chart-system'


const LineChart = ({ data, keys, typedKeys }) => {
  const [x, setX] = useState(null)
  const [ys, setYs] = useState([])
  useEffect(() => {
    setX((typedKeys.string || [])[0])
    setYs(typedKeys.number || [])
  }, [typedKeys])

  return (
    <>
      <div>
        {data && keys.length > 0 && (
          <div style={{ height: '90vh' }}>
            {Object.keys(typedKeys).length > 0 && (
              <>
                {typedKeys.string && (
                  <div>
                    <label htmlFor="x">X:</label>
                    <select name="x" value={x} onChange={({ target: { value } }) => setX(value)}>
                      {typedKeys.string.map(key => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  {[...(typedKeys.number || []), ...(typedKeys.boolean || [])].map(key => (
                    <span key={key} style={{ margin: '0 5px' }}>
                      <label htmlFor={`data-${key}`}>{key}:</label>
                      <input
                        name={`data-${key}`}
                        type="checkbox"
                        checked={ys.includes(key)}
                        onChange={({ target: { checked } }) => {
                          if (checked) {
                            setYs([...ys, key])
                          } else {
                            setYs(ys.filter(y => y !== key))
                          }
                        }}
                      />
                    </span>
                  ))}
                </div>
              </>
            )}
            <Line data={data} x={x} y={ys} />
          </div>
        )}
      </div>
      <div>
        <strong>Raw Data keys:</strong>
        <pre>
          <code>{JSON.stringify(keys, null, 2)}</code>
        </pre>
        <strong>Parsed keys by data types:</strong>
        <pre>
          <code>{JSON.stringify(typedKeys, null, 2)}</code>
        </pre>
      </div>
    </>
  )
}

export default LineChart
