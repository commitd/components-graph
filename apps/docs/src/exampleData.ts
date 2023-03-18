import { ModelEdge, ModelNode } from '@committed/components-graph'

const exampleNodesArr: ModelNode[] = [
  { id: 'n1', metadata: { type: 'person' } },
  { id: 'n2', metadata: { type: 'person' } },
  { id: 'n3', metadata: { type: 'person' } },
  { id: 'n4', metadata: { type: 'place' } },
  { id: 'n5', metadata: { type: 'place' } },
  { id: 'n6', metadata: { type: 'place' } },
]
const exampleEdgesArr: ModelEdge[] = [
  {
    id: 'e1',
    source: 'n1',
    target: 'n2',
  },
  {
    id: 'e2',
    source: 'n1',
    target: 'n3',
  },
  {
    id: 'e3',
    source: 'n3',
    target: 'n4',
  },
  {
    id: 'e5',
    source: 'n5',
    target: 'n5',
  },
]

export const exampleGraphData = {
  nodes: exampleNodesArr.reduce<Record<string, ModelNode>>((prev, next) => {
    prev[next.id as string] = next
    return prev
  }, {}),
  edges: exampleEdgesArr
}
