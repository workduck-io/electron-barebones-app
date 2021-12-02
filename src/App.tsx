import React, { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'

function App() {
  console.log('Inside the App component')
  const { selection, setSelection } = useState('')

  ipcRenderer.on('SEND_SELECTION', (_event, data) => {
    console.log('I was called')
    alert(data.text)
  })
  return <h1>Hello World! This part is delivered as an update!</h1>
}

export default App
