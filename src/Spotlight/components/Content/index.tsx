import { search as getSearchResults } from 'fast-fuzzy'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { DEFAULT_PREVIEW_TEXT } from '../../utils/constants'
import { useSpotlightContext } from '../../utils/context'
import { useCurrentIndex } from '../../utils/hooks'
import Preview from '../Preview'
import SideBar from '../SideBar'
import { useContentStore } from '../../../Editor/Store/ContentStore'
import { useEditorStore } from '../../../Editor/Store/EditorStore'
import { getNewDraftKey } from '../../../Editor/Components/SyncBlock/getNewBlockData'
import useDataStore from '../../../Editor/Store/DataStore'

export const StyledContent = styled.section`
  display: flex;
  flex: 1;
  max-height: 290px;
  margin: 0.5rem 0;
`

const initPreview = {
  text: DEFAULT_PREVIEW_TEXT,
  metadata: null
}

const Content = () => {
  const { search, selection, localData } = useSpotlightContext()

  const [data, setData] = useState<Array<any>>()
  const [nodeId, setNodeId] = useState(getNewDraftKey())
  const [preview, setPreview] = useState<any>(initPreview)
  const currentIndex = useCurrentIndex(data, search)
  const getContent = useContentStore((state) => state.getContent)

  const loadNodeFromId = useEditorStore(({ loadNodeFromId }) => loadNodeFromId)
  const { setIsNew } = useContentStore(({ setIsNew }) => ({ setIsNew }))
  const addILink = useDataStore((state) => state.addILink)

  useEffect(() => {
    setIsNew(true)
    const draftMexKey = getNewDraftKey()
    addILink(draftMexKey)
    setNodeId(draftMexKey)
    loadNodeFromId(draftMexKey)
  }, [])

  useEffect(() => {
    if (localData) {
      const results = getSearchResults(search, localData?.ilinks, { keySelector: (obj) => obj.key })
      if (search) {
        const resultsWithContent = results.map((result) => {
          const content = getContent(result.key)
          let rawText = ''

          content?.content.map((item) => {
            rawText += item?.children?.[0]?.text
            return item
          })

          return {
            ...result,
            desc: rawText
          }
        })
        setData(resultsWithContent)
      } else {
        setData(undefined)
      }
    }
  }, [search])

  useEffect(() => {
    const prevTemplate = {
      text: DEFAULT_PREVIEW_TEXT,
      metadata: null
    }

    if (!data) {
      if (selection) setPreview(selection)
      else setPreview(prevTemplate)
    } else if (data.length === 0) {
      setPreview({
        ...prevTemplate,
        text: 'No result found!'
      })
    } else {
      const contentKey = data[currentIndex]
      setPreview({
        ...prevTemplate,
        text: null
      })
      loadNodeFromId(contentKey.key)
      setNodeId(contentKey.key)
    }
  }, [data, currentIndex, selection])

  return (
    <StyledContent>
      <Preview preview={preview} nodeId={nodeId} />
      <SideBar index={currentIndex} data={data} />
    </StyledContent>
  )
}

export default Content
