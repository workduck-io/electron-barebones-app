/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console, react/no-access-state-in-setstate */
/* eslint-disable react/no-danger, no-param-reassign */
import RCTree from 'rc-tree'
import { Key } from 'rc-tree/lib/interface'
/* eslint-enable react/no-danger, no-param-reassign */
/* eslint-enable no-console, react/no-access-state-in-setstate */

import equal from 'fast-deep-equal'
import React from 'react'
import { withNodeOps } from '../../Editor/Store/EditorStore'
import { StyledTree } from '../../Styled/Sidebar'
import TreeNode from '../../Types/tree'
import TreeExpandIcon from './Icon'
import { withRefactor } from '../../Editor/Actions/useRefactor'
import { getNodeIdLast, SEPARATOR } from './treeUtils'

const motion = {
  motionName: 'node-motion',
  motionAppear: false,
  onAppearStart: (node: any) => {
    // eslint-disable-next-line no-console
    console.log('Start Motion:', node)
    return { height: 0 }
  },
  onAppearActive: (node: any) => ({ height: node.scrollHeight }),
  onLeaveStart: (node: any) => ({ height: node.offsetHeight }),
  onLeaveActive: () => ({ height: 0 })
}

interface RCTreeProps {
  tree: any
  currentNode: any
  loadNode: any
  getMockRefactor: any
  execRefactor: any
  prefillRefactorModal: any
}

/* Renders a draggable tree with custom collapse-able icon */
class Tree extends React.Component<RCTreeProps> {
  constructor (props: RCTreeProps) {
    super(props)
    this.state = {
      gData: props.tree,
      autoExpandParent: true
    }

    // These three functions were from the react-component/tree example
    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.onExpand = this.onExpand.bind(this)
    this.onSelect = this.onSelect.bind(this)
  }

  componentDidUpdate (prevProps: RCTreeProps) {
    const { tree } = this.props

    if (!equal(prevProps, this.props)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ gData: tree, expandedKeys: [this.props.currentNode.key] })
    }
  }

  onDragEnter ({ expandedKeys }: any) {
    // eslint-disable-next-line no-console
    console.log('enter', expandedKeys)
    this.setState({
      expandedKeys
    })
  }

  onDrop (info: any) {
    // eslint-disable-next-line no-console
    console.log('drop', info)
    const dropKey = info.node.props.eventKey
    const dragKey = info.dragNode.props.eventKey
    const dropPos = info.node.props.pos.split('-')
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

    const loop = (data: any, key: any, callback: any) => {
      data.forEach((item: any, index: any, arr: any) => {
        if (item.key === key) {
          callback(item, index, arr)
          return
        }
        if (item.children) {
          loop(item.children, key, callback)
        }
      })
    }
    const { gData: gDataTemp }: any = this.state
    const data = [...gDataTemp]

    // Find dragObject
    let dragObj: any
    loop(data, dragKey, (item: any, index: any, arr: any) => {
      arr.splice(index, 1)
      dragObj = item
    })

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item: any) => {
        item.children = item.children || []
        // where to insert
        item.children.push(dragObj)
      })
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item: any) => {
        item.children = item.children || []
        // where to insert
        item.children.unshift(dragObj)
      })
    } else {
      // Drop on the gap
      let ar: any
      let i: any
      loop(data, dropKey, (_item: any, index: any, arr: any) => {
        ar = arr
        i = index
      })
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj)
      } else {
        ar.splice(i + 1, 0, dragObj)
      }
    }

    // console.log('We be dropping stuff here', { dropPos, dragObj, dragKey, dropKey });

    const singleId = getNodeIdLast(dragKey)

    const from = dragKey
    const to = dropKey + SEPARATOR + singleId

    const { prefillRefactorModal: prefillModal } = this.props

    // console.log(getMockRefactor(from, to));
    prefillModal(from, to)

    // this.setState({
    //   gData: data,
    // });
  }

  onExpand (expandedKeys: any) {
    // eslint-disable-next-line no-console
    console.log('onExpand', expandedKeys)
    if (expandedKeys) {
      const newExp = expandedKeys.filter((k) => k)
      this.setState({
        expandedKeys: newExp,
        autoExpandParent: false
      })
    }
  }

  onSelect (_selectedKeys: Key[], info: any) {
    const { selectedNodes } = info
    const { loadNode } = this.props

    if (selectedNodes.length > 0) {
      loadNode(selectedNodes[0] as TreeNode)
    }
  }

  render () {
    const { expandedKeys, autoExpandParent }: any = this.state
    const { tree, currentNode } = this.props

    const newExpKeys = expandedKeys !== undefined ? expandedKeys : [currentNode.key]

    return (
      <StyledTree className="draggable-demo">
        <RCTree
          expandedKeys={newExpKeys}
          onExpand={this.onExpand}
          autoExpandParent={autoExpandParent}
          draggable
          // onDragStart={this.onDragStart}
          defaultExpandParent={true}
          onDragEnter={this.onDragEnter}
          selectedKeys={[currentNode.key]}
          onDrop={this.onDrop}
          treeData={tree}
          motion={motion}
          switcherIcon={TreeExpandIcon}
          showIcon={false}
          onSelect={this.onSelect}
        />
      </StyledTree>
    )
  }
}

export default withRefactor(withNodeOps(Tree))
