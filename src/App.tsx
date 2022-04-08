import React, { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'

function App() {
  const [version, setVersion] = useState<string>()
  console.log('Inside the App component')
  const { selection, setSelection } = useState('')

  useEffect(() => {
    async function setupIpc() {
      ipcRenderer.on('SEND_SELECTION', (_event, data) => {
        console.log('I was called')
        alert(data.text)
      })

      const v = await ipcRenderer.invoke('GET_VERSION')
      setVersion(v)
    }
    setupIpc()
  }, [])

  return <h1>Currently at Version {version}</h1>
}

export default App
