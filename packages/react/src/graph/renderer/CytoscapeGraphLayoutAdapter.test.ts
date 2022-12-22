import { GraphModel } from '@committed/graph'
import cytoscape, { CollectionArgument, NodeCollection } from 'cytoscape'
import {
  CUSTOM_LAYOUT_NAME,
  CytoscapeGraphLayoutAdapter,
  CytoscapeGraphLayoutAdapterManipulation,
  CytoscapeGraphLayoutAdapterOptions,
  register,
} from './CytoscapeGraphLayoutAdapter'

it('should not throw if cytoscape undefined', () => {
  const cyUseMock = jest.fn() as unknown as typeof cytoscape
  expect(() => register(cyUseMock)).not.toThrow()
})

it('should throw if no algorithm defined', () => {
  const adapter = {} as CytoscapeGraphLayoutAdapterManipulation
  CytoscapeGraphLayoutAdapter.bind(adapter)(
    {} as CytoscapeGraphLayoutAdapterOptions
  )
  expect(() => {
    adapter.run()
  }).toThrow()
})

it('should register with cytoscape', () => {
  const cyMock = jest.fn() as unknown as typeof cytoscape

  register(cyMock)

  expect(cyMock).toHaveBeenCalled()
  expect(cyMock).toHaveBeenCalledWith(
    'layout',
    CUSTOM_LAYOUT_NAME,
    CytoscapeGraphLayoutAdapter
  )
})

it('should run layout', () => {
  const model = GraphModel.createEmpty()
  const algorithm = {
    name: 'layout',
    runLayout: jest.fn().mockImplementation(() => []),
    stopLayout: jest.fn(),
  }
  const cy = { width: jest.fn(), height: jest.fn() }
  const id = jest.fn()
  const positions = jest.fn().mockImplementation((fn) => {
    fn({ id })
  })
  const eles = {
    nodes: () =>
      ({
        positions,
      } as unknown as NodeCollection),
  } as CollectionArgument
  const adapter = {} as CytoscapeGraphLayoutAdapterManipulation
  CytoscapeGraphLayoutAdapter.bind(adapter)({
    model,
    algorithm,
    eles,
    // @ts-ignore
    cy,
  })

  adapter.start()
  expect(algorithm.runLayout).toHaveBeenCalled()
  expect(positions).toHaveBeenCalled()
  expect(id).toHaveBeenCalled()

  adapter.stop()
  expect(algorithm.stopLayout).toHaveBeenCalled()
})
