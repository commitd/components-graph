import {
  largeGraph,
  smallGraph,
  veryLargeGraph,
} from 'test/data/jsonGraphExamples'
import { fromJsonGraph } from './fromJsonGraph'
import { JSONGraph, ModelNode } from './types'

it('Create from json graph spec graph values', () => {
  const contentModel = fromJsonGraph(smallGraph)
  expect(Object.keys(contentModel.nodes)).toHaveLength(4)
  expect(Object.keys(contentModel.edges)).toHaveLength(2)

  const node = contentModel.getNode('nissan') as ModelNode
  expect(node?.label).toBe('Nissan')

  const edge = contentModel.getEdgesLinkedToNode(node.id)[0]
  expect(edge.id).toBeDefined()
  expect(edge.source).toBe(node.id)
  expect(edge.target).toBe('infiniti')
  expect(edge.label).toBe('has_luxury_division')
  expect(edge.attributes.relation).toBe('has_luxury_division')
})

it('Create from json graph', () => {
  const contentModel = fromJsonGraph({
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
  expect(contentModel.getNode('n1')?.attributes.a1).toBe(true)
  expect(contentModel.getNode('n1')?.attributes.a2).toBe(10)
  expect(contentModel.getNode('n1')?.attributes.a3).toBe('test')
  expect((contentModel.getNode('n1')?.attributes.a4 as any).object).toBe(
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
  const contentModel = fromJsonGraph(largeGraph)
  expect(Object.keys(contentModel.nodes)).toHaveLength(9)
  expect(Object.keys(contentModel.edges)).toHaveLength(8)
})

it('ContentModel does support single from graphs', () => {
  const contentModel = fromJsonGraph({
    graphs: [smallGraph.graph as JSONGraph],
  })
  expect(Object.keys(contentModel.nodes)).toHaveLength(4)
  expect(Object.keys(contentModel.edges)).toHaveLength(2)
})

it('Create from json graph spec graph directly', () => {
  const contentModel = fromJsonGraph(largeGraph.graph as JSONGraph)
  expect(Object.keys(contentModel.nodes)).toHaveLength(9)
  expect(Object.keys(contentModel.edges)).toHaveLength(8)
})

it('ContentModel does not support empty from graphs', () => {
  expect(() =>
    fromJsonGraph({
      graphs: [],
    })
  ).toThrow()
})

it('ContentModel does not support empty model', () => {
  expect(() => fromJsonGraph({})).toThrow()
})

it('ContentModel does not support multiple from graphs', () => {
  expect(() =>
    fromJsonGraph({
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
    fromJsonGraph({
      graph: hyperGraph,
    })
  ).toThrow()
})

it('loads very large graph', () => {
  const contentModel = fromJsonGraph(veryLargeGraph)
  expect(Object.keys(contentModel.nodes)).toHaveLength(1000)
  expect(Object.keys(contentModel.edges)).toHaveLength(1000)
})
