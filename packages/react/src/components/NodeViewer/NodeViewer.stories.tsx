import { Button } from '@committed/components'
import { Generator, GraphModel, ModelNode } from '@committed/graph'
import { useBoolean } from '@committed/hooks'
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import { cytoscapeRenderer } from '../../graph/renderer/CytoscapeRenderer'
import { Graph } from '../Graph'
import { NodeViewer } from './NodeViewer'

export default {
  title: 'Components/NodeViewer',
  component: NodeViewer,
} as Meta

export const Default: Story = () => {
  const [model, setModel] = useState(Generator.randomGraph)

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
