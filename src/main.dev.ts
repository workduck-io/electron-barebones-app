/* eslint-disable @typescript-eslint/no-var-requires */
import { app, BrowserWindow, globalShortcut, clipboard, autoUpdater, dialog } from 'electron'
import fs from 'fs'
import path from 'path'
import { keyTap, typeString, setKeyboardDelay, keyToggle } from 'robotjs'
import activeWindow from 'active-win-universal'
import MenuBuilder from './menu'

import * as Sentry from '@sentry/electron'
import { Integrations as TracingIntegrations } from '@sentry/tracing'

declare const MEX_WINDOW_WEBPACK_ENTRY: string

export type SelectionType = {
  text: string
  metadata: activeWindow.Result | undefined
}
let updateCheckingFrequency = 3 * 60 * 60 * 1000
let updateSetInterval: ReturnType<typeof setInterval> | undefined

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

  const menuBuilder = new MenuBuilder(mex)
  menuBuilder.buildMenu()

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

export const checkIfAlpha = (version: string) => {
  return version.includes('-alpha')
}

export const buildUpdateFeedURL = () => {
  const version = app.getVersion()
  const isAlpha = checkIfAlpha(version)
  const base = 'https://reserv.workduck.io'
  let url: string

  if (process.arch == 'arm64') {
    url = base + `/update/osx_arm64/${version}`
  } else {
    url = base + `/update/osx_64/${version}`
  }

  if (isAlpha) url = url + '/alpha'

  return url
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleUpdateErrors = (err) => {
  console.log('There was an error, could not fetch updates: ', err.message)
}

export const setupAutoUpdates = () => {
  const feedURL = buildUpdateFeedURL()
  autoUpdater.setFeedURL({ url: feedURL })

  console.log('Update URL is: ', feedURL)

  autoUpdater.on('error', handleUpdateErrors)

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    console.log("Aye Aye Captain: There's an update")

    const dialogOpts = {
      title: "Aye Aye Captain: There's a Mex Update!",
      type: 'info',
      buttons: ['Install Update!', 'Later'],
      message: process.platform === 'win32' ? releaseName : releaseNotes,
      detail: 'Updates are on the way'
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
  })

  autoUpdater.on('update-available', () => {
    console.log('Update Available')
  })

  autoUpdater.on('update-not-available', () => {
    console.log('No Update Available!')
  })
}

if (app.isPackaged || process.env.FORCE_PRODUCTION) {
  updateCheckingFrequency = 60 * 60 * 1000
  setupAutoUpdates()

  setTimeout(() => {
    autoUpdater.checkForUpdates()
  }, 10 * 60 * 1000)

  updateSetInterval = setInterval(() => {
    autoUpdater.checkForUpdates()
  }, updateCheckingFrequency)
}
