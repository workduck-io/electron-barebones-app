import React, { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'

function App() {
  const { selection, setSelection } = useState('')

  ipcRenderer.on('SEND_SELECTION', (_event, data) => {
    console.log(data)
  })
  return <h1>Hello World! This part is delivered as an update!</h1>
}

export default App
