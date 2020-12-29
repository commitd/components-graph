import { GraphModel } from '../GraphModel'
import { cytoscapeRenderer } from './CytoscapeRenderer'
import { renderLight } from '../../setupTests'
import React from 'react'
import { Graph } from '../../components'
import { ModelNode, ModelEdge } from '..'
import { ContentModel } from '../ContentModel'

let cytoscape: any

jest.mock('react-cytoscapejs', () => {
  return {
    __esModule: true,
    default: ({ elements, cy }: { elements: any; cy: (cy: any) => void }) => {
      React.useEffect(() => {
        cy(cytoscape)
      }, [])

      return <div>{JSON.stringify(elements)}</div>
    },
  }
})

// Remove the debounce, to simplify tests
jest.mock('use-debounce', () => {
  return {
    useDebouncedCallback: (fn: any) => ({
      callback: fn,
    }),
  }
})

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
  cytoscape = {
    on: jest.fn(),
    fit: jest.fn(),
    zoom: jest.fn().mockImplementation(() => 1),
    removeAllListeners: jest.fn(),
    layout: jest.fn().mockImplementation(() => ({
      run: jest.fn(),
    })),
    width: () => 200,
    height: () => 400,
  }
})

it('can be rendered', () => {
  const onChange = jest.fn()

  const { asFragment, unmount } = renderLight(
    <Graph
      model={graphModel}
      onModelChange={onChange}
      renderer={cytoscapeRenderer}
      options={{ height: 'full-height' }}
    />
  )
  expect(asFragment()).toMatchSnapshot()
  expect(cytoscape.on).toHaveBeenCalledTimes(9)

  unmount()

  expect(cytoscape.removeAllListeners).toHaveBeenCalledTimes(1)
})

it('layout command triggers layout', () => {
  const onChange = jest.fn()

  const { rerender } = renderLight(
    <Graph
      model={graphModel}
      onModelChange={onChange}
      renderer={cytoscapeRenderer}
      options={{ height: 'full-height' }}
    />
  )

  graphModel = graphModel.pushCommand({ type: 'Layout' })

  cytoscape.layout.mockClear()

  rerender(
    <Graph
      model={graphModel}
      onModelChange={onChange}
      renderer={cytoscapeRenderer}
      options={{ height: 'full-height' }}
    />
  )

  expect(cytoscape.layout).toHaveBeenCalledTimes(2)
  expect(onChange).toBeCalledWith(graphModel.clearCommands())
})

it('refit command triggers refit', () => {
  const onChange = jest.fn()

  const { rerender } = renderLight(
    <Graph
      model={graphModel}
      onModelChange={onChange}
      renderer={cytoscapeRenderer}
      options={{ height: 'full-height' }}
    />
  )

  graphModel = graphModel.pushCommand({ type: 'Refit' })

  cytoscape.layout.mockClear()

  rerender(
    <Graph
      model={graphModel}
      onModelChange={onChange}
      renderer={cytoscapeRenderer}
      options={{ height: 'full-height' }}
    />
  )
  expect(cytoscape.fit).toHaveBeenCalledTimes(1)
  expect(onChange).toBeCalledWith(graphModel.clearCommands())
})

it('invalidate layout triggers layout', () => {
  const onChange = jest.fn()

  const { rerender } = renderLight(
    <Graph
      model={graphModel}
      onModelChange={onChange}
      renderer={cytoscapeRenderer}
      options={{ height: 'full-height' }}
    />
  )

  graphModel = GraphModel.applyLayout(
    graphModel,
    graphModel.getCurrentLayout().invalidate()
  )

  cytoscape.layout.mockClear()

  rerender(
    <Graph
      model={graphModel}
      onModelChange={onChange}
      renderer={cytoscapeRenderer}
      options={{ height: 'full-height' }}
    />
  )

  expect(onChange).toBeCalledWith(
    GraphModel.applyLayout(graphModel, graphModel.getCurrentLayout().validate())
  )
  expect(cytoscape.layout).toHaveBeenCalledTimes(1)
})

it('ZoomIn command triggers zoom', () => {
  const onChange = jest.fn()

  const { rerender } = renderLight(
    <Graph
      model={graphModel}
      onModelChange={onChange}
      renderer={cytoscapeRenderer}
      options={{ height: 'full-height' }}
    />
  )

  graphModel = graphModel.pushCommand({ type: 'ZoomIn' })

  rerender(
    <Graph
      model={graphModel}
      onModelChange={onChange}
      renderer={cytoscapeRenderer}
      options={{ height: 'full-height' }}
    />
  )
  expect(cytoscape.zoom).toHaveBeenCalledTimes(2)
  expect(onChange).toBeCalledWith(graphModel.clearCommands())
})

it('ZoomOut command triggers zoom', () => {
  const onChange = jest.fn()

  const { rerender } = renderLight(
    <Graph
      model={graphModel}
      onModelChange={onChange}
      renderer={cytoscapeRenderer}
      options={{ height: 'full-height' }}
    />
  )

  graphModel = graphModel.pushCommand({ type: 'ZoomOut' })

  rerender(
    <Graph
      model={graphModel}
      onModelChange={onChange}
      renderer={cytoscapeRenderer}
      options={{ height: 'full-height' }}
    />
  )
  expect(cytoscape.zoom).toHaveBeenCalledTimes(2)
  expect(onChange).toBeCalledWith(graphModel.clearCommands())
})
