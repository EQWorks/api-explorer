/* eslint-disable react/prop-types */
import React, { useState } from 'react' // no need to import `React` once 17

import { TextField } from '@eqworks/lumen-labs'

const RawDisplay = ({ data }) => {
  const [sampleSize, setSampleSize] = useState(1)

  return (
    <div>
      <TextField
        label='Sample size'
        value={sampleSize}
        onChange={setSampleSize}
        type='number'
      />
      <pre>
        <code>{JSON.stringify((data || []).slice(0, sampleSize), null, 2)}</code>
      </pre>
    </div>
  )
}

export default RawDisplay
