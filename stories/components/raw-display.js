/* eslint-disable react/prop-types */
import React, { useState } from 'react' // no need to import `React` once 17

const RawDisplay = ({ data }) => {
  const [sampleSize, setSampleSize] = useState(2)

  return (
    <div>
      <strong>
        Array Data Sample
        <label htmlFor="sampleSize">Sample Size:</label>
        <input name="sampleSize" type="number" value={sampleSize} onChange={({ target: { value } }) => setSampleSize(value)} />
      </strong>
      <pre>
        <code>{JSON.stringify((data || []).slice(0, sampleSize), null, 2)}</code>
      </pre>
    </div>
  )
}

export default RawDisplay
