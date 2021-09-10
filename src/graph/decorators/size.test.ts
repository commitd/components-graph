import { ContentModel } from '../'
import { ModelEdge, ModelNode } from '../types'
import { sizeEdgeByAttribute, sizeNodeByAttribute } from './size'

export const node1: ModelNode = {
  id: 'node1',
  attributes: {
    sizeBy: '50',
  },
}

export const node2: ModelNode = {
  id: 'node2',
  attributes: {
    sizeBy: 100,
  },
}

export const node3: ModelNode = {
  id: 'node3',
  attributes: {},
}

export const edge1: ModelEdge = {
  id: 'edge1',
  attributes: {
    sizeBy: '1',
  },
  source: 'node1',
  target: 'node2',
}

export const edge2: ModelEdge = {
  id: 'edge2',
  attributes: {
    sizeBy: 2,
  },
  source: 'node1',
  target: 'node2',
}

export const edge3: ModelEdge = {
  id: 'edge3',
  attributes: {
    sizeBy: '3',
  },
  source: 'node1',
  target: 'node2',
}

const contentModel = ContentModel.createEmpty()
  .addNode(node1)
  .addNode(node2)
  .addNode(node3)
  .addEdge(edge1)
  .addEdge(edge2)
  .addEdge(edge3)

it('Can size node by attribute', () => {
  const sizeByAttribute = sizeNodeByAttribute(contentModel, 'sizeBy')

  expect(sizeByAttribute(node1).size).toBe(10)
  expect(sizeByAttribute(node2).size).toBe(200)
  expect(sizeByAttribute(node3).size).toBe(undefined)
})

it('Can size node by attribute', () => {
  const sizeByAttribute = sizeNodeByAttribute(contentModel, 'sizeBy', [1, 10])

  expect(sizeByAttribute(node1).size).toBe(1)
  expect(sizeByAttribute(node2).size).toBe(10)
  expect(sizeByAttribute(node3).size).toBe(undefined)
})

it('Can size edge by attribute', () => {
  const sizeByAttribute = sizeEdgeByAttribute(contentModel, 'sizeBy', [1, 2])

  expect(sizeByAttribute(edge1).size).toBe(1)
  expect(sizeByAttribute(edge2).size).toBe(1.5)
  expect(sizeByAttribute(edge3).size).toBe(2)
})

it('Can size edge by attribute', () => {
  const sizeByAttribute = sizeEdgeByAttribute(contentModel, 'sizeBy')

  expect(sizeByAttribute(edge1).size).toBe(1)
  expect(sizeByAttribute(edge2).size).toBe(3)
  expect(sizeByAttribute(edge3).size).toBe(5)
})
