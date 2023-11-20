import { ContentModel, GraphModel, ModelEdge, ModelNode } from '../index'

// TEST DATA

export const node1: ModelNode = {
  id: 'node1',
  attributes: {
    employer: 'Committed',
  },
  color: 'yellow',
  label: 'Node 1',
  size: 10,
  strokeColor: 'black',
  opacity: 1,
  shape: 'ellipse',
  strokeSize: 2,
}

export const node2: ModelNode = {
  id: 'node2',
  attributes: {
    employer: 'Government',
  },
  color: 'green',
  label: 'Node 2',
  size: 12,
  strokeColor: 'black',
  opacity: 0.9,
  shape: 'rectangle',
  strokeSize: 3,
}

export const edge1: ModelEdge = {
  id: 'edge1',
  attributes: {
    role: 'client',
  },
  source: node1.id,
  target: node2.id,
}

export const exampleGraph = GraphModel.applyContent(
  GraphModel.createEmpty(),
  ContentModel.createEmpty().addNode(node1).addNode(node2).addEdge(edge1)
)
