/* eslint-disable @typescript-eslint/no-var-requires */
import { app, BrowserWindow, globalShortcut, clipboard, crashReporter } from 'electron'
import fs from 'fs'
import path from 'path'
import { keyTap, typeString, setKeyboardDelay, keyToggle } from 'robotjs'
import activeWindow from 'active-win-universal'

import * as Sentry from '@sentry/electron'
import { Integrations as TracingIntegrations } from '@sentry/tracing'

import todesktop from '@todesktop/runtime'

todesktop.init()

Sentry.init({
  dsn: 'https://b70722f27bbe487c913f2131a317f273@o1082596.ingest.sentry.io/6091296',
  integrations: [new TracingIntegrations.BrowserTracing()],
  tracesSampleRate: 1.0
})

app.commandLine.appendSwitch('inspect')

crashReporter.start({ submitURL: 'http://192.168.1.90:1127' })

declare const MEX_WINDOW_WEBPACK_ENTRY: string

export type SelectionType = {
  text: string
  metadata: activeWindow.Result | undefined
}

app.disableHardwareAcceleration()

export const simulateCopy = () => keyTap('c', process.platform === 'darwin' ? 'command' : 'control')

export const getSelectedTextSync = () => {
  setKeyboardDelay(100)
  const contentBackup = clipboard.readText()
  clipboard.clear()
  keyToggle('shift', 'down')
  keyTap('c', 'control')

  const selectedText = clipboard.readHTML()
  console.log('selected text: ', selectedText)
  clipboard.writeText(contentBackup)

  const ret = {
    text: selectedText,
    metadata: activeWindow.sync()
  }
  return ret
}

export const getSelectedText = async (): Promise<SelectionType> => {
  const contentBackup = clipboard.readText()
  clipboard.clear()
  simulateCopy()
  const windowDetails = await activeWindow()

  const selectedText = clipboard.readHTML()
  clipboard.writeText(contentBackup)

  return {
    text: selectedText,
    metadata: windowDetails
  }
}

if (require('electron-squirrel-startup')) {
  app.quit()
}

let mex: BrowserWindow | null

const MEX_WINDOW_OPTIONS = {
  width: 1600,
  height: 1500,
  titleBarStyle: 'hidden' as const,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    enableRemoteModule: true
  }
}

const createMexWindow = () => {
  mex = new BrowserWindow(MEX_WINDOW_OPTIONS)
  mex.loadURL(MEX_WINDOW_WEBPACK_ENTRY)

  global.mex = mex

  mex.on('closed', () => {
    mex = null
  })
}

const createWindow = () => {
  createMexWindow()
  mex?.webContents.openDevTools()
  if (process.platform === 'darwin') {
    app.dock.show()
  }
}

app.on('quit', () => {
  console.log('App quit')
})

const handleShortcut = async () => {
  mex?.webContents.send('SEND_SELECTION', { text: 'LAWDA LASSAN' })
  try {
    let selection: SelectionType
    if (process.platform === 'win32') {
      selection = getSelectedTextSync()
    } else if (process.platform === 'darwin') {
      selection = await getSelectedText()
    }
    console.log('Selection is: ', selection)
    const anyContentPresent = selection.text
    console.log(anyContentPresent)
    if (anyContentPresent) {
      console.log('Yo did this go?')
      mex?.webContents.send('SEND_SELECTION', selection)
      console.log('It did did it not')
    }
  } catch (err) {
    mex?.webContents.send('SEND_SELECTION', { text: err })
  }
}

app
  .whenReady()
  .then(() => {
    globalShortcut.register('CommandOrControl+Shift+L', handleShortcut)
  })
  .then(createWindow)
  .catch(console.error)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
