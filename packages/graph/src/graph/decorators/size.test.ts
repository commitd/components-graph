import { ContentModel } from '../'
import { Edge, Node } from '../types'
import { sizeEdgeByMetadata, sizeNodeByMetadata } from './size'

export const node1: Node = {
  id: 'node1',
  metadata: {
    sizeBy: '50',
  },
}

export const node2: Node = {
  id: 'node2',
  metadata: {
    sizeBy: 100,
  },
}

export const node3: Node = {
  id: 'node3',
  metadata: {},
}

export const edge1: Edge = {
  id: 'edge1',
  metadata: {
    sizeBy: '1',
  },
  source: 'node1',
  target: 'node2',
  directed: true,
}

export const edge2: Edge = {
  id: 'edge2',
  metadata: {
    sizeBy: 2,
  },
  source: 'node1',
  target: 'node2',
  directed: false,
}

export const edge3: Edge = {
  id: 'edge3',
  metadata: {
    sizeBy: '3',
  },
  source: 'node1',
  target: 'node2',
  directed: true,
}

const contentModel = ContentModel.createEmpty()
  .addNode(node1)
  .addNode(node2)
  .addNode(node3)
  .addEdge(edge1)
  .addEdge(edge2)
  .addEdge(edge3)

it('Can size node by attribute', () => {
  const sizeByAttribute = sizeNodeByMetadata(contentModel, 'sizeBy')

  expect(sizeByAttribute(node1).size).toBe(10)
  expect(sizeByAttribute(node2).size).toBe(200)
  expect(sizeByAttribute(node3).size).toBe(undefined)
})

it('Can size node by attribute', () => {
  const sizeByAttribute = sizeNodeByMetadata(contentModel, 'sizeBy', [1, 10])

  expect(sizeByAttribute(node1).size).toBe(1)
  expect(sizeByAttribute(node2).size).toBe(10)
  expect(sizeByAttribute(node3).size).toBe(undefined)
})

it('Can size edge by attribute', () => {
  const sizeByAttribute = sizeEdgeByMetadata(contentModel, 'sizeBy', [1, 2])

  expect(sizeByAttribute(edge1).size).toBe(1)
  expect(sizeByAttribute(edge2).size).toBe(1.5)
  expect(sizeByAttribute(edge3).size).toBe(2)
})

it('Can size edge by attribute', () => {
  const sizeByAttribute = sizeEdgeByMetadata(contentModel, 'sizeBy')

  expect(sizeByAttribute(edge1).size).toBe(1)
  expect(sizeByAttribute(edge2).size).toBe(3)
  expect(sizeByAttribute(edge3).size).toBe(5)
})
