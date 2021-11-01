import { GraphModel } from '@committed/graph'
import React from 'react'
import { Graph } from '../../components'
import { exampleGraph, renderLight } from '../../setupTests'
import { cytoscapeRenderer } from './CytoscapeRenderer'

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
    useDebouncedCallback: (fn: any) => fn,
  }
})

let graphModel: GraphModel

beforeEach(() => {
  graphModel = exampleGraph
  cytoscape = {
    on: jest.fn(),
    fit: jest.fn(),
    zoom: jest.fn().mockImplementation(() => 1),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    layout: jest.fn().mockImplementation(() => ({
      run: jest.fn(),
    })),
    dblclick: jest.fn(),
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
  expect(asFragment()).toBeDefined()
  expect(cytoscape.addListener).toHaveBeenCalledTimes(10)

  unmount()

  expect(cytoscape.removeListener).toHaveBeenCalledTimes(10)
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
  expect(onChange).toHaveBeenCalledWith(graphModel.clearCommands())
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
  expect(onChange).toHaveBeenCalledWith(graphModel.clearCommands())
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

  expect(onChange).toHaveBeenCalledWith(
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
  expect(onChange).toHaveBeenCalledWith(graphModel.clearCommands())
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
  expect(onChange).toHaveBeenCalledWith(graphModel.clearCommands())
})
