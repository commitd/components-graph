import React, { useState } from 'react'
import { Story, Meta } from '@storybook/react'
import { Graph } from '../Graph'
import { addRandomEdge, addRandomNode } from '../../graph/data/Generator'
import { GraphModel } from '../../graph/GraphModel'
import { cytoscapeRenderer } from '../../graph/renderer/CytoscapeRenderer'
import { NodeViewer } from './NodeViewer'
import { ModelNode } from '../../graph'

export default {
  title: 'Components/NodeViewer',
  component: NodeViewer,
  argTypes: {},
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
      <NodeViewer node={node} onClose={() => setNode(undefined)} />
      {graph}
    </>
  )
}
