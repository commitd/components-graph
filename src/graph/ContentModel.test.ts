import { edge1, node1, node2 } from '../setupTests'
import { ContentModel } from './ContentModel'

let contentModel: ContentModel

const attribute = 'att1'
const attributeValue = 'att1val'

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
  contentModel = ContentModel.fromRaw({ nodes: {}, edges: {} })
  expect(Object.keys(contentModel.nodes)).toHaveLength(0)
  expect(Object.keys(contentModel.edges)).toHaveLength(0)
})

it('Create from raw valid values', () => {
  contentModel = ContentModel.fromRaw({
    nodes: { [node1.id]: node1, [node2.id]: node2 },
    edges: { [edge1.id]: edge1 },
  })
  expect(Object.keys(contentModel.nodes)).toHaveLength(2)
  expect(Object.keys(contentModel.edges)).toHaveLength(1)
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

it('has no attributes when empty', () => {
  expect(Object.keys(contentModel.getNodeAttributes())).toHaveLength(0)
  expect(Object.keys(contentModel.getEdgeAttributes())).toHaveLength(0)
})

it('Can get node attributes', () => {
  contentModel = contentModel
    .addNode(node1)
    .addNodeAttribute(node1.id, attribute, attributeValue)
    .addNode(node2)
    .addNodeAttribute(node2.id, attribute, 10)

  const existingAttributeId = Object.keys(node1.attributes)[0]

  const attributeTypes = contentModel.getNodeAttributes()
  const attributeIds = Object.keys(attributeTypes)
  expect(attributeIds).toHaveLength(2)
  expect(attributeIds).toContain(attribute)
  expect(attributeIds).toContain(existingAttributeId)

  expect(attributeTypes[attribute].size).toBe(2)
  expect(attributeTypes[attribute].has('string')).toBeTruthy()
  expect(attributeTypes[attribute].has('number')).toBeTruthy()

  expect(attributeTypes[existingAttributeId].size).toBe(1)
  expect(attributeTypes[attribute].has('string')).toBeTruthy()
})

it('Can get edge attributes', () => {
  contentModel = contentModel.addNode(node1).addNode(node2).addEdge(edge1)

  const attributeTypes = contentModel.getEdgeAttributes()
  const attributeIds = Object.keys(attributeTypes)

  const existingAttributeId = Object.keys(edge1.attributes)[0]
  expect(attributeIds).toHaveLength(1)
  expect(attributeIds).toContain(Object.keys(edge1.attributes)[0])

  expect(attributeTypes[existingAttributeId].size).toBe(1)
  expect(attributeTypes[existingAttributeId].has('string')).toBeTruthy()
})
