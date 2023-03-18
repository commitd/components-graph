import { edge1, node1, node2 } from 'test/setup'
import { ContentModel } from './ContentModel'

let contentModel: ContentModel

const key = 'att1'
const value = 'att1val'

beforeEach(() => {
  contentModel = ContentModel.createEmpty()
})

it('has no data when created empty', () => {
  expect(Object.keys(contentModel.nodes)).toHaveLength(0)
  expect(Object.keys(contentModel.edges)).toHaveLength(0)
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
      metadata: {},
    })
  ).toThrow()

  expect(() =>
    contentModel.addNodeMetadata('nonexisting', 'key', 'value')
  ).toThrow()

  expect(() =>
    contentModel.editNodeMetadata('nonexisting', 'key', 'value')
  ).toThrow()

  expect(() => contentModel.removeNodeMetadata('nonexisting', 'key')).toThrow()
})

it('Throws editing non-existing edges', () => {
  expect(() =>
    contentModel.editEdge({
      id: 'nonexisting',
      metadata: {},
      source: 'nonexisting',
      target: 'nonexisting',
    })
  ).toThrow()

  expect(() =>
    contentModel.addEdgeMetadata('nonexisting', 'key', 'value')
  ).toThrow()

  expect(() =>
    contentModel.editEdgeMetadata('nonexisting', 'key', 'value')
  ).toThrow()

  expect(() => contentModel.removeEdgeMetadata('nonexisting', 'key')).toThrow()
})

it('Getting non-existing node', () => {
  expect(contentModel.getNode('nonexisting')).toBeUndefined()
})

it('Getting non-existing edge', () => {
  expect(contentModel.getEdge('nonexisting')).toBeUndefined()
})

it('Does not contain non-existing node', () => {
  expect(contentModel.containsNode('nonexisting')).toBe(false)
})

it('Does not contain non-existing edge', () => {
  expect(contentModel.containsEdge('nonexisting')).toBe(false)
})

it('Add fully specified node', () => {
  contentModel = contentModel.addNode(node1)
  expect(Object.keys(contentModel.nodes)).toHaveLength(1)
  expect(contentModel.getNode(node1.id)).toStrictEqual(node1)
})

it('Throws if trying to add existing node', () => {
  contentModel = contentModel.addNode(node1)
  expect(() => contentModel.addNode(node1)).toThrow()
})

it('Add fully unspecified node', () => {
  contentModel = contentModel.addNode({})
  const newNode = Object.values(contentModel.nodes)[0]
  expect(Object.keys(contentModel.nodes)).toHaveLength(1)
  expect(newNode.id).toBeTruthy()
})

it('Add node attribute', () => {
  contentModel = contentModel
    .addNode(node1)
    .addNodeMetadata(node1.id, key, value)
  const node = contentModel.getNode(node1.id)
  expect(node).toBeTruthy()
  expect(node!.metadata[key]).toBe(value)
})

it('Edit node attribute', () => {
  const newAttributeValue = 'att1val2'
  contentModel = contentModel
    .addNode(node1)
    .addNodeMetadata(node1.id, key, value)
    .editNodeMetadata(node1.id, key, newAttributeValue)
  const node = contentModel.getNode(node1.id)
  expect(node).toBeTruthy()
  expect(node!.metadata[key]).toBe(newAttributeValue)
})

it('Edit node attribute should throw if missing', () => {
  contentModel = contentModel.addNode(node1)

  expect(() => contentModel.editNodeMetadata(node1.id, key, value)).toThrow()
})

it('Remove node attribute', () => {
  contentModel = contentModel
    .addNode(node1)
    .addNodeMetadata(node1.id, key, value)
    .removeNodeMetadata(node1.id, key)
  const node = contentModel.getNode(node1.id)
  expect(node).toBeTruthy()
  expect(node!.metadata[key]).toBeFalsy()
})

it('Remove node', () => {
  contentModel = contentModel.addNode(node1).removeNode(node1.id)
  expect(contentModel.getNode(node1.id)).toBeFalsy()
  expect(Object.keys(contentModel.nodes)).toHaveLength(0)
})

it('Add fully specified edge with supporting nodes', () => {
  contentModel = contentModel.addNode(node1).addNode(node2).addEdge(edge1)
  expect(Object.keys(contentModel.nodes)).toHaveLength(2)
  expect(Object.keys(contentModel.edges)).toHaveLength(1)
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
  expect(Object.keys(contentModel.nodes)).toHaveLength(2)
  expect(Object.keys(contentModel.edges)).toHaveLength(1)
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
    .addEdgeMetadata(edge1.id, key, value)
  const edge = contentModel.getEdge(edge1.id)
  expect(edge).toBeTruthy()
  expect(edge!.metadata[key]).toBe(value)
})

it('Edit edge attribute', () => {
  const newAttributeValue = 'att1val2'
  contentModel = contentModel
    .addNode(node1)
    .addNode(node2)
    .addEdge(edge1)
    .addEdgeMetadata(edge1.id, key, value)
    .editEdgeMetadata(edge1.id, key, newAttributeValue)
  const edge = contentModel.getEdge(edge1.id)
  expect(edge).toBeTruthy()
  expect(edge!.metadata[key]).toBe(newAttributeValue)
})

it('Edit edge attribute throws if missing', () => {
  contentModel = contentModel.addNode(node1).addNode(node2).addEdge(edge1)

  expect(() => contentModel.editEdgeMetadata(edge1.id, key, value)).toThrow()
})

it('Remove edge attribute', () => {
  contentModel = contentModel
    .addNode(node1)
    .addNode(node2)
    .addEdge(edge1)
    .addEdgeMetadata(edge1.id, key, value)
    .removeEdgeMetadata(edge1.id, key)
  const node = contentModel.getNode(node1.id)
  expect(node).toBeTruthy()
  expect(node!.metadata[key]).toBeFalsy()
})

it('Remove edge', () => {
  contentModel = contentModel
    .addNode(node1)
    .addNode(node2)
    .addEdge(edge1)
    .removeEdge(edge1.id)
  expect(contentModel.getEdge(edge1.id)).toBeFalsy()
  expect(Object.keys(contentModel.edges)).toHaveLength(0)
})

it('Removing node with edges also removes edges', () => {
  contentModel = contentModel
    .addNode(node1)
    .addNode(node2)
    .addEdge(edge1)
    .removeNode(node1.id)
  expect(contentModel.getEdge(node1.id)).toBeFalsy()
  expect(contentModel.getEdge(edge1.id)).toBeFalsy()
  expect(Object.keys(contentModel.nodes)).toHaveLength(1)
  expect(Object.keys(contentModel.edges)).toHaveLength(0)
})

it('Adding edge with same source and target', () => {
  const edgeId = 'edgeid'
  contentModel = contentModel
    .addNode(node1)
    .addEdge({ id: edgeId, source: node1.id, target: node1.id })
  expect(Object.keys(contentModel.nodes)).toHaveLength(1)
  expect(Object.keys(contentModel.edges)).toHaveLength(1)
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
  expect(Object.keys(contentModel.nodes)).toHaveLength(2)
  expect(Object.keys(contentModel.edges)).toHaveLength(3)
  const edges = contentModel.getEdgesLinkedToNode(node1.id)
  expect(edges).toHaveLength(2)
  expect(edges[0].source || edges[0].target).toBe(node1.id)
  expect(edges[1].source || edges[1].target).toBe(node1.id)
})

it('Create from raw empty', () => {
  contentModel = ContentModel.fromRaw({ nodes: {}, edges: [] })
  expect(Object.keys(contentModel.nodes)).toHaveLength(0)
  expect(Object.keys(contentModel.edges)).toHaveLength(0)
})

it('Create from raw valid values', () => {
  contentModel = ContentModel.fromRaw({
    nodes: { [node1.id]: node1, [node2.id]: node2 },
    edges: [edge1],
  })
  expect(Object.keys(contentModel.nodes)).toHaveLength(2)
  expect(Object.keys(contentModel.edges)).toHaveLength(1)
})

it('Throws creating with missing edge target', () => {
  expect(
    () =>
      (contentModel = ContentModel.fromRaw({
        nodes: { [node1.id]: node1 },
        edges: [edge1],
      }))
  ).toThrow()
})

it('has no metadata when empty', () => {
  expect(Object.keys(contentModel.getNodeMetadataTypes())).toHaveLength(0)
  expect(Object.keys(contentModel.getEdgeMetadataTypes())).toHaveLength(0)
})

it('Can get node metadata', () => {
  contentModel = contentModel
    .addNode(node1)
    .addNodeMetadata(node1.id, key, value)
    .addNode(node2)
    .addNodeMetadata(node2.id, key, 10)

  const existingKey = Object.keys(node1.metadata)[0]

  const metadataSets = contentModel.getNodeMetadataTypes()
  const metadataKeys = Object.keys(metadataSets)
  expect(metadataKeys).toHaveLength(2)
  expect(metadataKeys).toContain(key)
  expect(metadataKeys).toContain(existingKey)

  expect(metadataSets[key].size).toBe(2)
  expect(metadataSets[key].has('string')).toBeTruthy()
  expect(metadataSets[key].has('number')).toBeTruthy()

  expect(metadataSets[existingKey].size).toBe(1)
  expect(metadataSets[key].has('string')).toBeTruthy()
})

it('Can get edge attributes', () => {
  contentModel = contentModel.addNode(node1).addNode(node2).addEdge(edge1)

  const metadataTypes = contentModel.getEdgeMetadataTypes()
  const metadataKeys = Object.keys(metadataTypes)

  const existingKey = Object.keys(edge1.metadata)[0]
  expect(metadataKeys).toHaveLength(1)
  expect(metadataKeys).toContain(Object.keys(edge1.metadata)[0])

  expect(metadataTypes[existingKey].size).toBe(1)
  expect(metadataTypes[existingKey].has('string')).toBeTruthy()
})
