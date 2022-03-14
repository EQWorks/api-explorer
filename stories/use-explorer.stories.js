/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react' // no need to import `React` once 17

import { ThemeProvider } from '@eqworks/lumen-ui'
import { Table } from '@eqworks/lumen-table'
import { PlotlyLineChart as Line } from '@eqworks/chart-system'

import { useExplorer } from '../src'


export default { title: 'API Explorer/useExplorer' }

const URLControls = ({ url, setURL, paths, path, setPath }) => (
  <div>
    <label htmlFor="url">Explore:</label>
    <input name="url" type="text" value={url} onChange={({ target: { value } }) => setURL(value)} />
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

const RawResponse = ({ sample }) => (
  <div>
    <strong>Raw Response</strong>
    <pre>
      <code>{JSON.stringify(sample, null, 2)}</code>
    </pre>
  </div>
)

export const WithLineChart = () => {
  const [url, setURL] = useState('https://api.coinstats.app/public/v1/coins?skip=0&limit=5&currency=EUR')
  const {
    data,
    paths,
    path,
    setPath,
    keys,
    typedKeys,
  } = useExplorer({ url })

  const [x, setX] = useState(null)
  const [ys, setYs] = useState([])
  useEffect(() => {
    setX((typedKeys.string || [])[0])
    setYs(typedKeys.number || [])
  }, [typedKeys])

  return (
    <div>
      <URLControls url={url} setURL={setURL} paths={paths} path={path} setPath={setPath} />
      <div>
        {data && keys.length > 0 && (
          <div style={{ height: '90vh' }}>
            {Object.keys(typedKeys).length > 0 && (
              <>
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
                <div>
                  {typedKeys.number.map(key => (
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
        <p>Raw Data keys:</p>
        <pre>
          <code>{JSON.stringify(keys, null, 2)}</code>
        </pre>
        <p>Parsed keys by data types:</p>
        <pre>
          <code>{JSON.stringify(typedKeys, null, 2)}</code>
        </pre>
      </div>
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
  } = useExplorer({ url })

  return (
    <ThemeProvider>
      <div>
        <URLControls url={url} setURL={setURL} paths={paths} path={path} setPath={setPath} />
        <div>
          <Table data={data} isBorder />
        </div>
        <RawResponse sample={sample} />
      </div>
    </ThemeProvider>
  )
}

export const Raw = () => { // raw explorer
  const [url, setURL] = useState('https://api.covid19api.com/summary')
  const [sampleSize, setSampleSize] = useState(2)
  const {
    sample,
    data,
    paths,
    path,
    setPath,
  } = useExplorer({ url })

  return (
    <div>
      <URLControls url={url} setURL={setURL} paths={paths} path={path} setPath={setPath} />
      <div>
        <div>
          <strong>
            Array Data Sample
            <label htmlFor="sampleSize">Sample Size:</label>
            <input name="sampleSize" type="number" value={sampleSize} onChange={({ target: { value } }) => setSampleSize(value)} />
          </strong>
        </div>
        <pre>
          <code>{JSON.stringify((data || []).slice(0, sampleSize), null, 2)}</code>
        </pre>
      </div>
      <RawResponse sample={sample} />
    </div>
  )
}
