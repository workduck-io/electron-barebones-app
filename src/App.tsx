import React, { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'

function App() {
  console.log('Inside the App component')
  const { selection, setSelection } = useState('')

  ipcRenderer.on('SEND_SELECTION', (_event, data) => {
    console.log('I was called')
    alert(data.text)
  })
  return <h1>Currently at Version 0.3.1-alpha.1</h1>
}

export default App
