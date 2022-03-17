/* eslint-disable react/prop-types */
import React, { useState } from 'react' // no need to import `React` once 17

import { TextField } from '@eqworks/lumen-labs'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'ace-builds/src-noconflict/ext-language_tools'

const RawDisplay = ({ data }) => {
  const [sampleSize, setSampleSize] = useState(1)

  return (
    <div>
      <AceEditor
        placeholder='Paste your sample JSON here'
        mode='json'
        theme='tomorrow'
        name='json-data'
        readOnly
        value={JSON.stringify((data || []).slice(0, sampleSize), null, 2)}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: false,
          tabSize: 2,
        }}
      />
      <TextField
        label='Sample size'
        value={sampleSize}
        onChange={setSampleSize}
        type='number'
      />
    </div>
  )
}

export default RawDisplay
