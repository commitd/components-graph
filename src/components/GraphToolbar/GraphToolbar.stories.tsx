import React, { useEffect, useState } from 'react'
import { Story, Meta } from '@storybook/react'
import { GraphToolbar, GraphToolbarProps } from '.'
import { Flex } from '@committed/components'
import { Graph } from '../Graph'
import { addRandomEdge, addRandomNode } from '../../graph/data/Generator'
import { GraphModel } from '../../graph/GraphModel'
import { cytoscapeRenderer } from '../../graph/renderer/CytoscapeRenderer'
import { ContentModel, CustomGraphLayout, DecoratedNode } from '../../graph'
import { useArgs } from '@storybook/addons'

function isFunction(
  modelChange: GraphModel | ((model: GraphModel) => GraphModel)
): modelChange is (model: GraphModel) => GraphModel {
  return typeof modelChange === 'function'
}

export default {
  title: 'Components/GraphToolbar',
  component: GraphToolbar,
  argTypes: {
    direction: {
      control: {
        type: 'radio',
        options: ['row', 'column'],
      },
      description: 'The direction of the toolbar.',
    },
    align: {
      control: {
        type: 'radio',
        options: ['start', 'end'],
      },
      description: 'Align items to the start or end of the toolbar.',
    },
    overlay: {
      control: {
        type: 'boolean',
      },
      description: 'Select to overlay the toolbar on the graph.',
    },
  },
} as Meta

export const Default: Story = ({
  model: startModel,
  onModelChange,
  ...args
}) => {
  const [model, setModel] = useState(
    () =>
      startModel ??
      addRandomEdge(addRandomNode(GraphModel.createEmpty(), 20), 15)
  )

  const handleModelChange = (
    modelChange: GraphModel | ((model: GraphModel) => GraphModel)
  ) => {
    if (isFunction(modelChange)) {
      onModelChange(modelChange(model))
    }
    setModel(modelChange)
  }

  return (
    <Flex
      css={{
        position: 'relative',
        flexDirection: args.direction === 'row' ? 'column' : 'row',
      }}
    >
      <GraphToolbar
        {...args}
        layouts={cytoscapeRenderer.layouts}
        model={model}
        onModelChange={handleModelChange}
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
      withGraph: boolean
    }>
> = ({ direction = 'row', css, withGraph = true, ...props }) => {
  const [model, setModel] = useState(
    addRandomEdge(addRandomNode(GraphModel.createEmpty(), 20), 15)
  )
  return (
    <Flex
      css={{
        position: 'relative',
        flexDirection: direction === 'row' ? 'column' : 'row',
      }}
    >
      <GraphToolbar
        {...props}
        direction={direction}
        css={css as any}
        model={model}
        onModelChange={setModel}
        layouts={cytoscapeRenderer.layouts}
      />
      {withGraph && (
        <Graph
          model={model}
          onModelChange={setModel}
          renderer={cytoscapeRenderer}
          options={{ height: 600 }}
        />
      )}
    </Flex>
  )
}

export const Vertical = Template.bind({})
Vertical.args = {
  direction: 'column',
}

export const Horizontal = Template.bind({})
Horizontal.args = { direction: 'row' }

export const Right = Template.bind({})
Right.args = { direction: 'row', align: 'end' }

export const Overlayed = Template.bind({})
Overlayed.args = {
  overlay: true,
}

export const IconProps = Template.bind({})
IconProps.args = { iconStyle: { color: '$success' } }

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
    <Flex css={{ flexDirection: 'row' }}>
      <GraphToolbar
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
