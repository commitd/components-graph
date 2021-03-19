import React, { useEffect, useState } from 'react'
import { Story, Meta } from '@storybook/react'
import { GraphToolbar, GraphToolbarProps } from '.'
import { Flex } from '@committed/components'
import { Graph } from '../Graph'
import { addRandomEdge, addRandomNode } from '../../graph/data/Generator'
import { GraphModel } from '../../graph/GraphModel'
import { cytoscapeRenderer } from '../../graph/renderer/CytoscapeRenderer'
import { ContentModel, CustomGraphLayout, DecoratedNode } from '../../graph'

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
        layouts={cytoscapeRenderer.layouts}
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

const typesLayout: CustomGraphLayout = {
  name: 'Data Structure',
  runLayout: (model: GraphModel): Record<string, cytoscape.Position> => {
    const paddingTop = 50
    const paddingLeft = 50
    const columnWidth = 250
    const rowHeight = 75
    const byType = Object.values(
      model.nodes.reduce<Record<string, DecoratedNode[]>>((acc, next) => {
        acc[(next.attributes.type ?? 'unknown') as string] = (
          acc[(next.attributes.type ?? 'unknown') as string] ?? []
        ).concat(next)
        return acc
      }, {})
    )
    let column = 0
    return byType.reduce<Record<string, cytoscape.Position>>((acc, nodes) => {
      let row = 0
      nodes.forEach((n) => {
        acc[n.id] = {
          x: column * columnWidth + paddingLeft,
          y: row * rowHeight + paddingTop,
        }
        row++
      })

      column++
      return acc
    }, {})
  },
  stopLayout: () => {},
}

const Template: Story<
  Omit<GraphToolbarProps, 'model' | 'onModelChange' | 'layouts'> &
    Partial<{
      layouts: GraphToolbarProps['layouts']
      model: GraphToolbarProps['model']
    }>
> = ({ flexDirection = 'row', ...props }) => {
  const [model, setModel] = useState(
    addRandomEdge(addRandomNode(GraphModel.createEmpty(), 20), 15)
  )
  return (
    <Flex flexDirection={flexDirection === 'row' ? 'column' : 'row'}>
      <GraphToolbar
        flexDirection={flexDirection}
        model={model}
        onModelChange={setModel}
        layouts={cytoscapeRenderer.layouts}
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

export const CustomLayout: Story = () => {
  const [model, setModel] = useState(
    GraphModel.createWithContent(
      ContentModel.fromRaw({
        nodes: {
          e1: {
            id: 'e1',
            label: 'Type 1',
            attributes: {
              type: 'type1',
            },
          },
          e2: {
            id: 'e2',
            label: 'Type 2',
            attributes: {
              type: 'type2',
            },
          },
          e3: {
            id: 'e3',
            label: 'Type 3',
            attributes: {
              type: 'type3',
            },
          },
          e4: {
            id: 'e4',
            label: 'Type 1 (2)',
            attributes: {
              type: 'type1',
            },
          },
        },
        edges: {},
      })
    )
  )
  useEffect(() => {
    setModel((m) =>
      GraphModel.applyLayout(m, m.getCurrentLayout().customLayout(typesLayout))
    )
  }, [])
  return (
    <Flex flexDirection="column">
      <GraphToolbar
        flexDirection="row"
        model={model}
        onModelChange={setModel}
        layouts={[...cytoscapeRenderer.layouts, typesLayout]}
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
