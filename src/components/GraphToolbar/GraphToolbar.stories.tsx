import React, { useState } from 'react'
import { Story, Meta } from '@storybook/react'
import { GraphToolbar, GraphToolbarProps } from '.'
import { Flex } from '@committed/components'
import { Graph } from '../Graph/Graph'
import { addRandomEdge, addRandomNode } from '../../graph/data/Generator'
import { GraphModel } from '../../graph/GraphModel'
import { cytoscapeRenderer } from '../../graph/renderer/CytoscapeRenderer'

export default {
  title: 'Components/GraphToolbar',
  component: GraphToolbar,
} as Meta

export const Vertical: React.FC = () => {
  return <Template direction="column" />
}

export const Horizontal: React.FC = () => {
  return <Template direction="row" />
}

const Template: Story<{ direction: GraphToolbarProps['direction'] }> = ({
  direction,
}) => {
  const [model, setModel] = useState(
    addRandomEdge(addRandomNode(GraphModel.createEmpty(), 20), 15)
  )
  return (
    <Flex flexDirection={direction === 'row' ? 'column' : 'row'}>
      <GraphToolbar
        direction={direction}
        model={model}
        onModelChange={setModel}
      />
      <Graph
        model={model}
        onModelChange={setModel}
        renderer={cytoscapeRenderer}
        options={{ height: 600 }}
      />
    </Flex>
  )
}
