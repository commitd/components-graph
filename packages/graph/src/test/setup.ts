import { ContentModel, Edge, GraphModel, Node } from 'index'

// TEST DATA

export const node1: Node = {
  id: 'node1',
  metadata: {
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

export const node2: Node = {
  id: 'node2',
  metadata: {
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

export const edge1: Edge = {
  id: 'edge1',
  metadata: {
    role: 'client',
  },
  source: node1.id,
  target: node2.id,
  directed: true,
}

export const exampleGraph = GraphModel.applyContent(
  GraphModel.createEmpty(),
  ContentModel.createEmpty().addNode(node1).addNode(node2).addEdge(edge1)
)
