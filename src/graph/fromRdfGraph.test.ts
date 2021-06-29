import { decorated, sample, small } from './data/rdf'
import { fromRdfGraph, LiteralObject, LiteralOption } from './fromRdfGraph'
import { ModelNode } from './types'

it('Create from ttl string', () => {
  const contentModel = fromRdfGraph(sample)
  expect(Object.keys(contentModel.nodes)).toHaveLength(16)
  expect(Object.keys(contentModel.edges)).toHaveLength(13)

  const node = contentModel.getNode(
    'http://example.org/data/transaction/123'
  ) as ModelNode

  const processedAt = node?.attributes[
    'http://example.org/ont/transaction-log/processedAt'
  ] as LiteralObject
  const statusCode = node?.attributes[
    'http://example.org/ont/transaction-log/statusCode'
  ] as LiteralObject
  expect(processedAt.value).toBe('2015-10-16T10:22:23')
  expect(processedAt.dataType).toBe('http://www.w3.org/2001/XMLSchema#dateTime')
  expect(statusCode.value).toBe('200')
  expect(statusCode.dataType).toBe('http://www.w3.org/2001/XMLSchema#integer')

  const edge = contentModel.getEdgesLinkedToNode(node.id)[0]
  expect(edge.id).toBeDefined()
  expect(edge.source).toBe(node.id)
  expect(edge.target).toBe('http://example.org/data/server/A')
  expect(edge.label).toBe('http://example.org/ont/transaction-log/processedBy')
})

it('Create from ttl string using prefixes', () => {
  const contentModel = fromRdfGraph(sample, { usePrefix: true })
  expect(Object.keys(contentModel.nodes)).toHaveLength(16)
  expect(Object.keys(contentModel.edges)).toHaveLength(13)

  const node = contentModel.getNode('txn:123') as ModelNode
  const processedAt = node?.attributes['log:processedAt'] as LiteralObject
  const statusCode = node?.attributes['log:statusCode'] as LiteralObject
  expect(processedAt.value).toBe('2015-10-16T10:22:23')
  expect(processedAt.dataType).toBe('xsd:dateTime')
  expect(statusCode.value).toBe('200')
  expect(statusCode.dataType).toBe('xsd:integer')

  const edge = contentModel.getEdgesLinkedToNode(node.id)[0]
  expect(edge.id).toBeDefined()
  expect(edge.source).toBe(node.id)
  expect(edge.target).toBe('srv:A')
  expect(edge.label).toBe('log:processedBy')
})

it('Can process literals to rdf literal string', () => {
  const contentModel = fromRdfGraph(sample, {
    usePrefix: true,
    literals: LiteralOption.AS_STRING,
  })
  const node = contentModel.getNode('txn:123') as ModelNode
  expect(node?.attributes['log:processedAt']).toBe(
    `"2015-10-16T10:22:23"^^http://www.w3.org/2001/XMLSchema#dateTime`
  )
  expect(node?.attributes['log:statusCode']).toBe(
    '"200"^^http://www.w3.org/2001/XMLSchema#integer'
  )
})

it('Can process literals to value only', () => {
  const contentModel = fromRdfGraph(sample, {
    usePrefix: true,
    literals: LiteralOption.VALUE_ONLY,
  })
  const node = contentModel.getNode('txn:123') as ModelNode
  expect(node?.attributes['log:processedAt']).toEqual(
    new Date('2015-10-16T10:22:23')
  )
  expect(node?.attributes['log:statusCode']).toBe(200)
})

it('Can parse simple example by adding missing prefixes', () => {
  const contentModel = fromRdfGraph(small, {
    usePrefix: true,
    additionalPrefixes: {
      owl: 'http://www.w3.org/2002/07/owl#',
      xsd: 'http://www.w3.org/2001/XMLSchema#',
      // NOTE needs to be last to stop others matching
      '': '',
    },
  })
  expect(Object.keys(contentModel.nodes)).toHaveLength(7)
  expect(Object.keys(contentModel.edges)).toHaveLength(5)

  const node = contentModel.getNode(':John') as ModelNode
  expect(node.attributes['type']).toBe(':Man')
  const name = node?.attributes[':name'] as LiteralObject
  expect(name.value).toBe('John')
  expect(name.dataType).toBe('xsd:string')

  const edge = contentModel
    .getEdgesLinkedToNode(node.id)
    .find((e) => e.label === ':hasSpouse')
  expect(edge?.id).toBeDefined()
  expect(edge?.source).toBe(node.id)
  expect(edge?.target).toBe(':Mary')
  expect(edge?.label).toBe(':hasSpouse')

  const blankNodeId = contentModel
    .getEdgesLinkedToNode(':event')
    .find((e) => e.label === ':has_time_span')?.target as string
  const blankNode = contentModel.getNode(blankNodeId)
  const attribute = blankNode?.attributes[
    ':at_some_time_within_date'
  ] as LiteralObject
  expect(attribute.value).toBe('2018-01-12')
})

it('Can parse simple example adding nodes for type', () => {
  const contentModel = fromRdfGraph(small, {
    type: undefined,
    additionalPrefixes: {
      '': '',
      owl: 'http://www.w3.org/2002/07/owl#',
      xsd: 'http://www.w3.org/2001/XMLSchema#',
    },
  })
  expect(Object.keys(contentModel.nodes)).toHaveLength(12)
  expect(Object.keys(contentModel.edges)).toHaveLength(12)

  expect(contentModel.getNode('John')).toBeDefined()
  expect(contentModel.getNode('Man')).toBeDefined()
})

it('Decorates by default', () => {
  const contentModel = fromRdfGraph(decorated)

  const node = contentModel.getNode('A')
  expect(node?.label).toBe('Test')
  expect(node?.size).toBe(10)
  expect(node?.color).toBe('#FFBB00')
  expect(node?.opacity).toBe(0.5)
  expect(node?.shape).toBe('diamond')
  expect(node?.strokeColor).toBe('#000000')
  expect(node?.strokeSize).toBe(1)
})

it('Decorates by default', () => {
  const contentModel = fromRdfGraph(decorated, {
    usePrefix: true,
    decorate: false,
    literals: LiteralOption.VALUE_ONLY,
  })

  const node = contentModel.getNode('A')
  expect(node?.size).toBeUndefined()
  expect(node?.attributes['cd:color']).toBe('#FFBB00')
})
