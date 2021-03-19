import { GraphModel } from '../GraphModel'
import {
  CustomLayoutOptions,
  CytoscapeGraphLayoutAdapter,
} from './CytoscapeGraphLayoutAdapter'
import { CollectionArgument, NodeCollection } from 'cytoscape'

it('should not throw if cytoscape undefined', () => {
  expect(CytoscapeGraphLayoutAdapter.register).not.toThrow()
})

it('should throw if no algorigthm defined', () => {
  const adapter = new CytoscapeGraphLayoutAdapter(
    {} as cytoscape.LayoutPositionOptions & CustomLayoutOptions
  )
  expect(() => {
    adapter.run()
  }).toThrow()
})

it('should register with cytoscape', () => {
  const cyMock = jest.fn()

  CytoscapeGraphLayoutAdapter.register(cyMock)

  expect(cyMock).toHaveBeenCalled()
  expect(cyMock).toHaveBeenCalledWith(
    'layout',
    CytoscapeGraphLayoutAdapter.LAYOUT_NAME,
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
      (({
        positions,
      } as unknown) as NodeCollection),
  } as CollectionArgument
  const adapter = new CytoscapeGraphLayoutAdapter({
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
