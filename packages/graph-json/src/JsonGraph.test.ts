import { Node } from '@committed/graph'
import { largeGraph, smallGraph, veryLargeGraph } from 'examples'
import { buildGraph, Graph as JSONGraph } from 'JsonGraph'

it('Create from json graph spec graph values', () => {
  const contentModel = buildGraph(smallGraph)
  expect(Object.keys(contentModel.nodes)).toHaveLength(4)
  expect(Object.keys(contentModel.edges)).toHaveLength(2)

  const node = contentModel.getNode('nissan') as Node
  expect(node?.label).toBe('Nissan')

  const edge = contentModel.getEdgesLinkedToNode(node.id)[0]
  expect(edge.id).toBeDefined()
  expect(edge.source).toBe(node.id)
  expect(edge.target).toBe('infiniti')
  expect(edge.label).toBe('has_luxury_division')
  expect(edge.metadata.relation).toBe('has_luxury_division')
})

it('Create from json graph', () => {
  const contentModel = buildGraph({
    nodes: {
      n1: {
        metadata: { a1: true, a2: 10, a3: 'test', a4: { object: 'example' } },
      },
      n2: { label: 'example2' },
      n3: {},
    },
    edges: [
      { id: 'edge1', source: 'n1', target: 'n2' },
      { id: 'edge2', source: 'n1', target: 'n3', label: 'test' },
    ],
  })
  expect(Object.keys(contentModel.nodes)).toHaveLength(3)
  expect(Object.keys(contentModel.edges)).toHaveLength(2)
  expect(contentModel.getNode('n1')).toBeDefined()
  expect(contentModel.getNode('n1')?.metadata.a1).toBe(true)
  expect(contentModel.getNode('n1')?.metadata.a2).toBe(10)
  expect(contentModel.getNode('n1')?.metadata.a3).toBe('test')
  expect((contentModel.getNode('n1')?.metadata.a4 as any).object).toBe(
    'example'
  )
  expect(contentModel.getNode('n2')).toBeDefined()
  expect(contentModel.getNode('n3')).toBeDefined()
  expect(contentModel.getNode('n2')?.label).toBe('example2')
  expect(contentModel.getEdge('edge1')).toBeDefined()
  expect(contentModel.getEdge('edge1')?.source).toBe('n1')
  expect(contentModel.getEdge('edge1')?.target).toBe('n2')
  expect(contentModel.getEdge('edge2')?.label).toBe('test')
})

it('Create from json graph spec graph values', () => {
  const contentModel = buildGraph(largeGraph)
  expect(Object.keys(contentModel.nodes)).toHaveLength(9)
  expect(Object.keys(contentModel.edges)).toHaveLength(8)
})

it('ContentModel does support single from graphs', () => {
  const contentModel = buildGraph({
    graphs: [smallGraph.graph as JSONGraph],
  })
  expect(Object.keys(contentModel.nodes)).toHaveLength(4)
  expect(Object.keys(contentModel.edges)).toHaveLength(2)
})

it('Create from json graph spec graph directly', () => {
  const contentModel = buildGraph(largeGraph.graph as JSONGraph)
  expect(Object.keys(contentModel.nodes)).toHaveLength(9)
  expect(Object.keys(contentModel.edges)).toHaveLength(8)
})

it('ContentModel does not support empty from graphs', () => {
  expect(() =>
    buildGraph({
      graphs: [],
    })
  ).toThrow()
})

it('ContentModel does not support empty model', () => {
  expect(() => buildGraph({})).toThrow()
})

it('ContentModel does not support multiple from graphs', () => {
  expect(() =>
    buildGraph({
      graphs: [smallGraph.graph as JSONGraph, largeGraph.graph as JSONGraph],
    })
  ).toThrow()
})

it('ContentModel does not support hyperedges from graphs', () => {
  const hyperGraph = {
    nodes: smallGraph.graph?.nodes,
    hyperedges: smallGraph.graph?.edges,
  } as unknown as JSONGraph
  expect(() =>
    buildGraph({
      graph: hyperGraph,
    })
  ).toThrow()
})

it('loads very large graph', () => {
  const contentModel = buildGraph(veryLargeGraph)
  expect(Object.keys(contentModel.nodes)).toHaveLength(1000)
  expect(Object.keys(contentModel.edges)).toHaveLength(1000)
})
