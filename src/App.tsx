import React, { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'
import Amplify, { Auth } from 'aws-amplify'
import config from './awsconfig'

function App() {
  console.log('Inside the App component')
  const { selection, setSelection } = useState('')
  const [data, setData] = useState('')
  useEffect(() => {
    Amplify.configure(config)
  }, [])

  ipcRenderer.on('SEND_SELECTION', (_event, data) => {
    console.log('I was called')
    alert(data.text)
  })

  const onSignupGoogle = (e) => {
    Amplify.configure(Auth)
    const x = Auth.federatedSignIn({ provider: 'google' as any }).then((res) => res)
    setData(x)
    ipcRenderer.send('INIT_GOOGLE_OAUTH')
  }

  return (
    <div>
      <h1>Currently at Version 0.3.1-alpha.2 because of an update</h1>
      <button onClick={onSignupGoogle}>Sign In with Google!</button>
      <h1>{data}</h1>
    </div>
  )
}

export default App
