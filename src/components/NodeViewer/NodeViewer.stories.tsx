import React, { useState } from 'react'
import { Story, Meta } from '@storybook/react'
import { Graph } from '../Graph'
import { addRandomEdge, addRandomNode } from '../../graph/data/Generator'
import { GraphModel } from '../../graph/GraphModel'
import { cytoscapeRenderer } from '../../graph/renderer/CytoscapeRenderer'
import { NodeViewer } from './NodeViewer'
import { ModelNode } from '../../graph'
import { Button } from '@committed/components'
import { useBoolean } from '@committed/hooks'

export default {
  title: 'Components/NodeViewer',
  component: NodeViewer,
} as Meta

export const Default: Story = () => {
  const [model, setModel] = useState(
    addRandomEdge(addRandomNode(GraphModel.createEmpty(), 20), 15)
  )
  const [node, setNode] = useState<ModelNode | undefined>(
    Object.values(model.getCurrentContent().nodes)[0]
  )
  const graph = (
    <Graph
      model={model}
      onModelChange={setModel}
      renderer={cytoscapeRenderer}
      options={{ height: 600 }}
      onViewNode={setNode}
    />
  )
  return (
    <>
      <NodeViewer
        open={node != null}
        node={node}
        onOpenChange={() => setNode(undefined)}
      />
      {graph}
    </>
  )
}

export const WithAttributes: Story = () => {
  const [open, { setTrue: setOpen, setFalse: setClosed }] = useBoolean(false)
  const node: ModelNode = {
    id: 'test',
    label: 'example node',
    attributes: {
      employer: 'Committed',
    },
  }
  return (
    <>
      <Button onClick={setOpen}>Open</Button>
      <NodeViewer open={open} node={node} onOpenChange={setClosed} />
    </>
  )
}

export const NoAttributes: Story = () => {
  const [open, { setTrue: setOpen, setFalse: setClosed }] = useBoolean(false)
  const node: ModelNode = {
    id: 'test',
    label: 'example node',
    attributes: {},
  }
  return (
    <>
      <Button onClick={setOpen}>Open</Button>
      <NodeViewer open={open} node={node} onOpenChange={setClosed} />
    </>
  )
}

export const NoNode: Story = () => {
  const [open, { setTrue: setOpen, setFalse: setClosed }] = useBoolean(false)
  return (
    <>
      <Button onClick={setOpen}>Open</Button>
      <NodeViewer open={open} onOpenChange={setClosed} />
    </>
  )
}
