import React, { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'

function App() {
  console.log('Inside the App component')
  const { selection, setSelection } = useState('')

  ipcRenderer.on('SEND_SELECTION', (_event, data) => {
    console.log('I was called')
    alert(data.text)
  })
  return <h1>YAAAAAAAAAAAAAAY! THIS WAS DELIVERED AS PART OF ANOTHER UPDATE, AND VERSION IS NOW 0.3.0!</h1>
}

export default App
