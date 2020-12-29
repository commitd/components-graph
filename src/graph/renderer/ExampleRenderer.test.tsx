import { GraphModel } from '../GraphModel'
import { exampleRenderer } from './ExampleRenderer'
import { renderLight, renderDark, userEvent } from '../../setupTests'
import React from 'react'
import { Graph } from '../../components'
import { ModelNode, ModelEdge } from '..'
import { ContentModel } from '../ContentModel'

let graphModel: GraphModel

const node1: ModelNode = {
  id: 'node1',
  attributes: {
    employer: 'Committed',
  },
  color: 'yellow',
  label: 'Node 1',
  size: 10,
  strokeColor: 'black',
  opacity: 1,
  shape: 'ellipse',
  strokeSize: 2,
}

const node2: ModelNode = {
  id: 'node2',
  attributes: {
    employer: 'Government',
  },
  color: 'green',
  label: 'Node 2',
  size: 12,
  strokeColor: 'black',
  opacity: 0.9,
  shape: 'rectangle',
  strokeSize: 3,
}

const edge1: ModelEdge = {
  id: 'edge1',
  attributes: {
    role: 'client',
  },
  source: node1.id,
  target: node2.id,
}

beforeEach(() => {
  graphModel = GraphModel.applyContent(
    GraphModel.createEmpty(),
    ContentModel.createEmpty().addNode(node1).addNode(node2).addEdge(edge1)
  )
})

it('can be rendered light', () => {
  const onChange = jest.fn()

  const { asFragment } = renderLight(
    <Graph
      model={graphModel}
      onModelChange={onChange}
      renderer={exampleRenderer}
      options={{ height: 'full-height' }}
    />
  )
  expect(asFragment()).toMatchSnapshot()
})

it('can be rendered light', () => {
  const onChange = jest.fn()

  const { asFragment } = renderDark(
    <Graph
      model={graphModel}
      onModelChange={onChange}
      renderer={exampleRenderer}
      options={{ height: 'full-height' }}
    />
  )
  expect(asFragment()).toMatchSnapshot()
})

it('can add node', () => {
  const onChange = jest.fn()

  const { getByText } = renderLight(
    <Graph
      model={graphModel}
      onModelChange={onChange}
      renderer={exampleRenderer}
      options={{ height: 'full-height' }}
    />
  )

  userEvent.click(getByText('Add Node'))
  expect(onChange).toHaveBeenCalled()
})

it('can add Edge', () => {
  const onChange = jest.fn()

  const { getByText } = renderLight(
    <Graph
      model={graphModel}
      onModelChange={onChange}
      renderer={exampleRenderer}
      options={{ height: 'full-height' }}
    />
  )

  userEvent.click(getByText('Add Edge'))
  expect(onChange).toHaveBeenCalled()
})

it('can not add edge if empty', () => {
  const onChange = jest.fn()

  const { getByText } = renderLight(
    <Graph
      model={GraphModel.createEmpty()}
      onModelChange={onChange}
      renderer={exampleRenderer}
      options={{ height: 'full-height' }}
    />
  )

  userEvent.click(getByText('Add Edge'))
  expect(onChange).not.toHaveBeenCalled()
})
