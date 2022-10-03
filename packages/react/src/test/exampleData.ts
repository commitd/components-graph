import { ModelEdge, ModelNode } from '@committed/graph'

const exampleNodesArr: ModelNode[] = [
  { id: 'n1', attributes: { type: 'person' } },
  { id: 'n2', attributes: { type: 'person' } },
  { id: 'n3', attributes: { type: 'person' } },
  { id: 'n4', attributes: { type: 'place' } },
  { id: 'n5', attributes: { type: 'place' } },
  { id: 'n6', attributes: { type: 'place' } },
]
const exampleEdgesArr: ModelEdge[] = [
  {
    id: 'e1',
    source: 'n1',
    target: 'n2',
    attributes: {},
  },
  {
    id: 'e2',
    source: 'n1',
    target: 'n3',
    attributes: {},
  },
  {
    id: 'e3',
    source: 'n3',
    target: 'n4',
    attributes: {},
  },
  {
    id: 'e5',
    source: 'n5',
    target: 'n5',
    attributes: {},
  },
]

export const exampleGraphData = {
  nodes: exampleNodesArr.reduce<Record<string, ModelNode>>((prev, next) => {
    prev[next.id] = next
    return prev
  }, {}),
  edges: exampleEdgesArr.reduce<Record<string, ModelEdge>>((prev, next) => {
    prev[next.id] = next
    return prev
  }, {}),
}
