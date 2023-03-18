import { Flex } from '@committed/components'
import {
  ContentModel,
  CustomGraphLayout, cytoscapeRenderer, DecoratedNode,
  Generator, Graph, GraphModel, GraphToolbar, GraphToolbarProps
} from '@committed/components-graph'
import { Meta, Story } from '@storybook/react'
import React, { useEffect, useState } from 'react'

function isFunction(
  modelChange: GraphModel | ((model: GraphModel) => GraphModel)
): modelChange is (model: GraphModel) => GraphModel {
  return typeof modelChange === 'function'
}

const empty = {
  zoom: false,
  layout: false,
  relayout: false,
  refit: false,
  hide: false,
  size: false,
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
    () => startModel ?? Generator.randomGraph()
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
        acc[(next.metadata.type ?? 'unknown') as string] = (
          acc[(next.metadata.type ?? 'unknown') as string] ?? []
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
> = ({
  direction = 'row',
  css,
  withGraph = true,
  layouts = cytoscapeRenderer.layouts,
  ...props
}) => {
  const [model, setModel] = useState(Generator.randomGraph)

  return (
    <Flex
      css={{
        position: 'relative',
        flexDirection: direction === 'row' ? 'column' : 'row',
      }}
    >
      <GraphToolbar
        direction={direction}
        css={css as any}
        model={model}
        onModelChange={setModel}
        layouts={layouts}
        {...props}
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

export const Zoom = Template.bind({})
Zoom.args = {
  ...empty,
  zoom: true,
}

export const Layout = Template.bind({})
Layout.args = {
  ...empty,
  layout: true,
}

export const Refit = Template.bind({})
Refit.args = {
  ...empty,
  refit: true,
}

export const SizeBy = Template.bind({})
SizeBy.args = {
  ...empty,
  size: true,
}

export const Hide = Template.bind({})
Hide.args = {
  ...empty,
  hide: true,
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
            metadata: {
              type: 'type1',
            },
          },
          e2: {
            id: 'e2',
            label: 'Type 2',
            metadata: {
              type: 'type2',
            },
          },
          e3: {
            id: 'e3',
            label: 'Type 3',
            metadata: {
              type: 'type3',
            },
          },
          e4: {
            id: 'e4',
            label: 'Type 1 (2)',
            metadata: {
              type: 'type1',
            },
          },
        },
        edges: [],
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

export const Empty = Template.bind({})
Empty.args = empty
