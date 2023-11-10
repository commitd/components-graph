import { Flex } from '@committed/ds'
import {
  CustomGraphLayout,
  DecoratedNode,
  Generator,
  GraphModel,
} from '@committed/graph'
import React, { useState } from 'react'
import { GraphToolbar, GraphToolbarProps } from '.'
import { cytoscapeRenderer } from '../../graph'
import { renderDark, renderLight, userEvent } from '../../test/setup'
import { Graph } from '../Graph'

const empty = {
  zoom: false,
  layout: false,
  relayout: false,
  refit: false,
  hide: false,
  size: false,
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

type TemplateProps = Omit<
  GraphToolbarProps,
  'model' | 'onModelChange' | 'layouts' | 'direction'
> &
  Partial<{
    layouts: GraphToolbarProps['layouts']
    model: GraphToolbarProps['model']
    withGraph: boolean
  }>

const Template: React.FC<TemplateProps & { direction?: 'row' | 'column' }> = ({
  direction = 'row',
  withGraph = true,
  layouts = cytoscapeRenderer.layouts,
  ...props
}) => {
  const [model, setModel] = useState(Generator.randomGraph)

  return (
    <Flex
      flexDirection={direction === 'row' ? 'column' : 'row'}
      css={{
        position: 'relative',
      }}
    >
      <GraphToolbar
        direction={direction}
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

const Vertical: React.FC<TemplateProps> = (props: TemplateProps) => (
  <Template direction="column" {...props} />
)

const Horizontal: React.FC<TemplateProps> = (props: TemplateProps) => (
  <Template direction="row" {...props} />
)

export const Layout: React.FC<TemplateProps> = (props: TemplateProps) => (
  <Template {...empty} layout {...props} />
)

export const Relayout: React.FC<TemplateProps> = (props: TemplateProps) => (
  <Template {...empty} relayout {...props} />
)

export const SizeBy: React.FC<TemplateProps> = (props: TemplateProps) => (
  <Template {...empty} size {...props} />
)

export const Hide: React.FC<TemplateProps> = (props: TemplateProps) => (
  <Template {...empty} hide {...props} />
)

export const Empty: React.FC<TemplateProps> = (props: TemplateProps) => (
  <Template {...empty} {...props} />
)

it('renders light', () => {
  const { asFragment } = renderLight(<Horizontal withGraph={false} />)
  expect(asFragment()).toBeDefined()
})

it('renders dark', () => {
  const { asFragment } = renderDark(<Vertical withGraph={false} />)
  expect(asFragment()).toBeDefined()
})

test.each([
  [/zoom-in/i, 'ZoomIn'],
  [/zoom-out/i, 'ZoomOut'],
  [/layout/i, 'Layout'],
  [/refit/i, 'Refit'],
])('button label %s issues command %s', (pattern, command) => {
  const onChange = jest.fn()
  const { getByRole } = renderLight(
    <GraphToolbar
      direction="row"
      model={GraphModel.createEmpty()}
      onModelChange={onChange}
      layouts={cytoscapeRenderer.layouts}
    />
  )

  userEvent.click(getByRole('button', { name: pattern }))
  const newModel = onChange.mock.calls[0][0] as GraphModel
  expect(newModel.getCommands()[0]).toEqual({ type: command })
})

it('renders empty', () => {
  const { asFragment } = renderDark(<Empty withGraph={false} />)
  expect(asFragment()).toBeDefined()
})
