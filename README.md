# API Explorer

Headless React library for arbitrary API endpoints exploration.

## Installation

```bash
npm i @eqworks/api-explorer
# or
yarn add @eqworks/api-explorer
```

## Usage

### `useExplorer`

With built-in `fetch` based API client, you can use `useExplorer` hook to explore arbitrary API endpoints with a simple React component like this:

```jsx
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
```

### `useSample`

If you want to use a custom API client, you can use `useSample` hook to handle the rest of the API explorer logic:

```jsx
import React from 'react'
import { useSample } from '@eqworks/api-explorer'

const SampleExplorer = ({ sample }) => {
  // every `useExplorer` hook property except `loading` and `error`
  const {
    data,
    paths,
    path,
    setPath,
    flatten,
    setFlatten,
    keys,
    typedKeys,
  } = useSample(sample)

  return (...)
}
```
