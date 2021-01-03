import React, { useState } from 'react'
import { Story, Meta } from '@storybook/react'
import { GraphToolbar, GraphToolbarProps } from '.'
import { Flex } from '@committed/components'
import { Graph } from '../Graph'
import { addRandomEdge, addRandomNode } from '../../graph/data/Generator'
import { GraphModel } from '../../graph/GraphModel'
import { cytoscapeRenderer } from '../../graph/renderer/CytoscapeRenderer'

export default {
  title: 'Components/GraphToolbar',
  component: GraphToolbar,
} as Meta

const Template: Story<Omit<GraphToolbarProps, 'model' | 'onModelChange'>> = ({
  flexDirection = 'row',
  ...props
}) => {
  const [model, setModel] = useState(
    addRandomEdge(addRandomNode(GraphModel.createEmpty(), 20), 15)
  )
  return (
    <Flex flexDirection={flexDirection === 'row' ? 'column' : 'row'}>
      <GraphToolbar
        flexDirection={flexDirection}
        model={model}
        onModelChange={setModel}
        {...props}
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

export const Vertical: React.FC = () => {
  return <Template flexDirection="column" />
}

export const Horizontal: React.FC = () => {
  return <Template flexDirection="row" />
}

export const Right: React.FC = () => {
  return <Template flexDirection="row" justifyContent="flex-end" />
}

export const Bottom: React.FC = () => {
  return <Template flexDirection="column" justifyContent="flex-end" />
}

export const Overlayed: React.FC = () => {
  return (
    <Template flexDirection="row" position="absolute" top="32px" zIndex="1" />
  )
}

export const IconProps: React.FC = () => {
  return <Template iconProps={{ color: 'secondary' }} />
}
