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
  argTypes: {},
} as Meta

export const Default: Story<{ flexDirection?: 'row' | 'column' }> = ({
  flexDirection = 'row',
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

export const Vertical = Template.bind({})
Vertical.args = {
  flexDirection: 'column',
}

export const Horizontal = Template.bind({})
Horizontal.args = { flexDirection: 'row' }

export const Right = Template.bind({})
Right.args = { flexDirection: 'row', justifyContent: 'flex-end' }

export const Bottom = Template.bind({})
Bottom.args = {
  flexDirection: 'column',
  justifyContent: 'flex-end',
}

export const Overlayed = Template.bind({})
Overlayed.args = {
  flexDirection: 'row',
  position: 'absolute',
  top: '32px',
  zIndex: '1',
}

export const IconProps = Template.bind({})
IconProps.args = { iconProps: { color: 'secondary' } }
