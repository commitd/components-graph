import { edge1, node1, node2 } from '../setupTests'
import { ContentModel } from './ContentModel'
import { largeGraph, smallGraph } from './data/jsonGraphExamples'
import { JSONGraph, ModelNode } from './types'

let contentModel: ContentModel

const attribute = 'att1'
const attributeValue = 'att1val'

beforeEach(() => {
  contentModel = ContentModel.createEmpty()
})

it('has no data when created empty', () => {
  expect(Object.keys(contentModel.nodes).length).toBe(0)
  expect(Object.keys(contentModel.edges).length).toBe(0)
})

it('Removing non-existing nodes is idempotent', () => {
  expect(contentModel.removeNode('nonexisting')).toBe(contentModel)
})

it('Removing non-existing edges is idempotent', () => {
  expect(contentModel.removeEdge('nonexisting')).toBe(contentModel)
})

it('Throws editing non-existing nodes', () => {
  expect(() =>
    contentModel.editNode({
      id: 'nonexisting',
      attributes: {},
    })
  ).toThrow()

  expect(() =>
    contentModel.addNodeAttribute('nonexisting', 'attribute', 'value')
  ).toThrow()

  expect(() =>
    contentModel.editNodeAttribute('nonexisting', 'attribute', 'value')
  ).toThrow()

  expect(() =>
    contentModel.removeNodeAttribute('nonexisting', 'attribute')
  ).toThrow()
})

it('Throws editing non-existing edges', () => {
  expect(() =>
    contentModel.editEdge({
      id: 'nonexisting',
      attributes: {},
      source: 'nonexisting',
      target: 'nonexisting',
    })
  ).toThrow()

  expect(() =>
    contentModel.addEdgeAttribute('nonexisting', 'attribute', 'value')
  ).toThrow()

  expect(() =>
    contentModel.editEdgeAttribute('nonexisting', 'attribute', 'value')
  ).toThrow()

  expect(() =>
    contentModel.removeEdgeAttribute('nonexisting', 'attribute')
  ).toThrow()
})

it('Getting non-existing node', () => {
  expect(contentModel.getNode('nonexisting')).toBeUndefined()
})

it('Getting non-existing edge', () => {
  expect(contentModel.getEdge('nonexisting')).toBeUndefined()
})

it('Doesnt contain non-existing node', () => {
  expect(contentModel.containsNode('nonexisting')).toBe(false)
})

it('Doesnt contain non-existing edge', () => {
  expect(contentModel.containsEdge('nonexisting')).toBe(false)
})

it('Add fully specified node', () => {
  contentModel = contentModel.addNode(node1)
  expect(Object.keys(contentModel.nodes).length).toBe(1)
  expect(contentModel.getNode(node1.id)).toStrictEqual(node1)
})

it('Throws if trying to add existing node', () => {
  contentModel = contentModel.addNode(node1)
  expect(() => contentModel.addNode(node1)).toThrow()
})

it('Add fully unspecified node', () => {
  contentModel = contentModel.addNode({})
  const newNode = Object.values(contentModel.nodes)[0]
  expect(Object.keys(contentModel.nodes).length).toBe(1)
  expect(newNode.id).toBeTruthy()
})

it('Add node attribute', () => {
  contentModel = contentModel
    .addNode(node1)
    .addNodeAttribute(node1.id, attribute, attributeValue)
  const node = contentModel.getNode(node1.id)
  expect(node).toBeTruthy()
  expect(node!.attributes[attribute]).toBe(attributeValue)
})

it('Edit node attribute', () => {
  const newAttributeValue = 'att1val2'
  contentModel = contentModel
    .addNode(node1)
    .addNodeAttribute(node1.id, attribute, attributeValue)
    .editNodeAttribute(node1.id, attribute, newAttributeValue)
  const node = contentModel.getNode(node1.id)
  expect(node).toBeTruthy()
  expect(node!.attributes[attribute]).toBe(newAttributeValue)
})

it('Edit node attribute should throw if missing', () => {
  contentModel = contentModel.addNode(node1)

  expect(() =>
    contentModel.editNodeAttribute(node1.id, attribute, attributeValue)
  ).toThrow()
})

it('Remove node attribute', () => {
  contentModel = contentModel
    .addNode(node1)
    .addNodeAttribute(node1.id, attribute, attributeValue)
    .removeNodeAttribute(node1.id, attribute)
  const node = contentModel.getNode(node1.id)
  expect(node).toBeTruthy()
  expect(node!.attributes[attribute]).toBeFalsy()
})

it('Remove node', () => {
  contentModel = contentModel.addNode(node1).removeNode(node1.id)
  expect(contentModel.getNode(node1.id)).toBeFalsy()
  expect(Object.keys(contentModel.nodes).length).toBe(0)
})

it('Add fully specified edge with supporting nodes', () => {
  contentModel = contentModel.addNode(node1).addNode(node2).addEdge(edge1)
  expect(Object.keys(contentModel.nodes).length).toBe(2)
  expect(Object.keys(contentModel.edges).length).toBe(1)
  expect(contentModel.getEdge(edge1.id)).toStrictEqual(edge1)
})

it('Throws adding edge without supporting source', () => {
  expect(() => contentModel.addNode(node2).addEdge(edge1)).toThrow()
})

it('Throws adding edge without supporting target', () => {
  expect(() => contentModel.addNode(node1).addEdge(edge1)).toThrow()
})

it('Add fully unspecified edge with supporting nodes', () => {
  contentModel = contentModel.addNode(node1).addNode(node2).addEdge({
    source: node1.id,
    target: node2.id,
  })
  expect(Object.keys(contentModel.nodes).length).toBe(2)
  expect(Object.keys(contentModel.edges).length).toBe(1)
  const newEdge = Object.values(contentModel.edges)[0]
  expect(newEdge.id).toBeTruthy()
})

it('Throws if trying to add existing node', () => {
  const edge = {
    id: 'test',
    source: node1.id,
    target: node2.id,
  }
  contentModel = contentModel.addNode(node1).addNode(node2).addEdge(edge)
  expect(() => contentModel.addEdge(edge)).toThrow()
})

it('Add edge attribute', () => {
  contentModel = contentModel
    .addNode(node1)
    .addNode(node2)
    .addEdge(edge1)
    .addEdgeAttribute(edge1.id, attribute, attributeValue)
  const edge = contentModel.getEdge(edge1.id)
  expect(edge).toBeTruthy()
  expect(edge!.attributes[attribute]).toBe(attributeValue)
})

it('Edit edge attribute', () => {
  const newAttributeValue = 'att1val2'
  contentModel = contentModel
    .addNode(node1)
    .addNode(node2)
    .addEdge(edge1)
    .addEdgeAttribute(edge1.id, attribute, attributeValue)
    .editEdgeAttribute(edge1.id, attribute, newAttributeValue)
  const edge = contentModel.getEdge(edge1.id)
  expect(edge).toBeTruthy()
  expect(edge!.attributes[attribute]).toBe(newAttributeValue)
})

it('Edit edge attribute throws if missing', () => {
  contentModel = contentModel.addNode(node1).addNode(node2).addEdge(edge1)

  expect(() =>
    contentModel.editEdgeAttribute(edge1.id, attribute, attributeValue)
  ).toThrow()
})

it('Remove edge attribute', () => {
  contentModel = contentModel
    .addNode(node1)
    .addNode(node2)
    .addEdge(edge1)
    .addEdgeAttribute(edge1.id, attribute, attributeValue)
    .removeEdgeAttribute(edge1.id, attribute)
  const node = contentModel.getNode(node1.id)
  expect(node).toBeTruthy()
  expect(node!.attributes[attribute]).toBeFalsy()
})

it('Remove edge', () => {
  contentModel = contentModel
    .addNode(node1)
    .addNode(node2)
    .addEdge(edge1)
    .removeEdge(edge1.id)
  expect(contentModel.getEdge(edge1.id)).toBeFalsy()
  expect(Object.keys(contentModel.edges).length).toBe(0)
})

it('Removing node with edges also removes edges', () => {
  contentModel = contentModel
    .addNode(node1)
    .addNode(node2)
    .addEdge(edge1)
    .removeNode(node1.id)
  expect(contentModel.getEdge(node1.id)).toBeFalsy()
  expect(contentModel.getEdge(edge1.id)).toBeFalsy()
  expect(Object.keys(contentModel.nodes).length).toBe(1)
  expect(Object.keys(contentModel.edges).length).toBe(0)
})

it('Adding edge with same source and target', () => {
  const edgeId = 'edgeid'
  contentModel = contentModel
    .addNode(node1)
    .addEdge({ id: edgeId, source: node1.id, target: node1.id })
  expect(Object.keys(contentModel.nodes).length).toBe(1)
  expect(Object.keys(contentModel.edges).length).toBe(1)
  expect(contentModel.getNode(node1.id)).toBeTruthy()
  expect(contentModel.getEdge(edgeId)).toBeTruthy()
  const edge = contentModel.getEdge(edgeId)
  expect(edge).toBeTruthy()
  expect(edge!.source).toBe(edge!.target)
})

it('Gets all edges linked to node', () => {
  contentModel = contentModel
    .addNode(node1)
    .addNode(node2)
    .addEdge(edge1)
    .addEdge({ id: 'edgeid', source: node2.id, target: node2.id })
    .addEdge({ id: 'edgeid2', source: node1.id, target: node1.id })
  expect(Object.keys(contentModel.nodes).length).toBe(2)
  expect(Object.keys(contentModel.edges).length).toBe(3)
  const edges = contentModel.getEdgesLinkedToNode(node1.id)
  expect(edges.length).toBe(2)
  expect(edges[0].source || edges[0].target).toBe(node1.id)
  expect(edges[1].source || edges[1].target).toBe(node1.id)
})

it('Create from raw empty', () => {
  contentModel = ContentModel.fromRaw({ nodes: {}, edges: {} })
  expect(Object.keys(contentModel.nodes).length).toBe(0)
  expect(Object.keys(contentModel.edges).length).toBe(0)
})

it('Create from raw valid values', () => {
  contentModel = ContentModel.fromRaw({
    nodes: { [node1.id]: node1, [node2.id]: node2 },
    edges: { [edge1.id]: edge1 },
  })
  expect(Object.keys(contentModel.nodes).length).toBe(2)
  expect(Object.keys(contentModel.edges).length).toBe(1)
})

it('Throws creating with missing edge target', () => {
  expect(
    () =>
      (contentModel = ContentModel.fromRaw({
        nodes: { [node1.id]: node1 },
        edges: { [edge1.id]: edge1 },
      }))
  ).toThrow()
})

it('Create from json graph spec graph values', () => {
  contentModel = ContentModel.fromJsonGraph(smallGraph)
  expect(Object.keys(contentModel.nodes).length).toBe(4)
  expect(Object.keys(contentModel.edges).length).toBe(2)

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
  contentModel = ContentModel.fromJsonGraph({
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
  expect(Object.keys(contentModel.nodes).length).toBe(3)
  expect(Object.keys(contentModel.edges).length).toBe(2)
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
  contentModel = ContentModel.fromJsonGraph(largeGraph)
  expect(Object.keys(contentModel.nodes).length).toBe(9)
  expect(Object.keys(contentModel.edges).length).toBe(8)
})

it('ContentModel does support single from graphs', () => {
  contentModel = ContentModel.fromJsonGraph({
    graphs: [smallGraph.graph as JSONGraph],
  })
  expect(Object.keys(contentModel.nodes).length).toBe(4)
  expect(Object.keys(contentModel.edges).length).toBe(2)
})

it('Create from json graph spec graph directly', () => {
  contentModel = ContentModel.fromJsonGraph(largeGraph.graph as JSONGraph)
  expect(Object.keys(contentModel.nodes).length).toBe(9)
  expect(Object.keys(contentModel.edges).length).toBe(8)
})

it('ContentModel does not support empty from graphs', () => {
  expect(() =>
    ContentModel.fromJsonGraph({
      graphs: [],
    })
  ).toThrow()
})

it('ContentModel does not support empty model', () => {
  expect(() => ContentModel.fromJsonGraph({})).toThrow()
})

it('ContentModel does not support multiple from graphs', () => {
  expect(() =>
    ContentModel.fromJsonGraph({
      graphs: [smallGraph.graph as JSONGraph, largeGraph.graph as JSONGraph],
    })
  ).toThrow()
})

it('ContentModel does not support hyperedges from graphs', () => {
  const hyperGraph = ({
    nodes: smallGraph.graph?.nodes,
    hyperedges: smallGraph.graph?.edges,
  } as unknown) as JSONGraph
  expect(() =>
    ContentModel.fromJsonGraph({
      graph: hyperGraph,
    })
  ).toThrow()
})
