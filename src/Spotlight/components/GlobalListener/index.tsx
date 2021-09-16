import React, { memo, useEffect, useState } from 'react'
import { useSpotlightContext } from '../../utils/context'
import { useSpotlightEditorStore } from '../../store/editor'
import { getHtmlString } from '../../components/Source'
import { useSpotlightSettingsStore } from '../../store/settings'
import { ipcRenderer } from 'electron'
import { IpcAction } from '../../utils/constants'
import { FileData } from '../../../Types/data'
import { getNewDraftKey } from '../../../Editor/Components/SyncBlock/getNewBlockData'
import { useRecentsStore } from '../../../Editor/Store/RecentsStore'
import { useInitialize, AppType } from '../../../Data/useInitialize'
import { useSpotlightAppStore } from '../../../Spotlight/store/app'
import { useHistory, useLocation } from 'react-router'

const GlobalListener = memo(() => {
  const history = useHistory()
  const location = useLocation()
  const [temp, setTemp] = useState<any>()
  const { setSelection, setSearch } = useSpotlightContext()
  const setIsPreview = useSpotlightEditorStore((state) => state.setIsPreview)
  const showSource = useSpotlightSettingsStore((state) => state.showSource)
  const setBubble = useSpotlightSettingsStore((state) => state.setBubble)
  const { addRecent, clear } = useRecentsStore(({ addRecent, clear }) => ({ addRecent, clear }))
  const setReset = useSpotlightAppStore((state) => state.setReset)

  const { init, update } = useInitialize()

  useEffect(() => {
    if (showSource && temp) {
      const source = getHtmlString(temp.metadata)
      const text: string = temp.text

      const html = {
        ...temp,
        text: text.concat(source)
      }
      setSelection(html)
    } else {
      setSelection(temp)
    }
    setIsPreview(true)
  }, [showSource, temp])

  useEffect(() => {
    ipcRenderer.on(IpcAction.SELECTED_TEXT, (_event, data) => {
      console.log(location.pathname)
      if (location.pathname === '/') {
        setSearch('')
      }
      if (!data) {
        setSelection(undefined)
        setIsPreview(false)
      } else setTemp(data)
    })

    ipcRenderer.on(IpcAction.SPOTLIGHT_BLURRED, () => {
      setReset()
    })

    ipcRenderer.on(IpcAction.RECIEVE_LOCAL_DATA, (_event, arg: FileData) => {
      const editorID = getNewDraftKey()
      init(arg, editorID, AppType.SPOTLIGHT)
    })

    ipcRenderer.on(IpcAction.SPOTLIGHT_BUBBLE, (_event, arg) => {
      setBubble()
    })

    ipcRenderer.on(IpcAction.CLEAR_RECENTS, (_event) => {
      clear()
    })

    ipcRenderer.on(IpcAction.NEW_RECENT_ITEM, (_event, { data }) => {
      addRecent(data)
    })

    ipcRenderer.on(IpcAction.SYNC_DATA, (_event, arg) => {
      update(arg)
    })

    ipcRenderer.send(IpcAction.GET_LOCAL_DATA)
  }, [])

  return <></>
})

GlobalListener.displayName = 'GlobalListener'

export default GlobalListener
