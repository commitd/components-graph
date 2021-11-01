import { GraphModel } from '../GraphModel'
import {
  addRandomNode,
  removeRandomNode,
  addRandomEdge,
  removeRandomEdge,
  addRandomNodeColors,
  addRandomNodeShapes,
  randomNode,
} from './Generator'

it('should add node and edge', () => {
  const graph = addRandomEdge(addRandomNode(GraphModel.createEmpty()))
  expect(graph.nodes).toHaveLength(1)
  expect(graph.edges).toHaveLength(1)
})

it('should be empty', () => {
  const start = GraphModel.createEmpty()
  const middle = addRandomEdge(addRandomNode(start, 10), 5)
  expect(middle.nodes).toHaveLength(10)
  expect(middle.edges).toHaveLength(5)

  const end = removeRandomNode(removeRandomEdge(middle, 5), 10)

  expect(end).toEqual(start)
})

it('should add shape', () => {
  const start = addRandomNodeShapes(
    addRandomNodeShapes(GraphModel.createEmpty(), 9)
  )
  const node = randomNode(start.getCurrentContent())
  expect(node?.shape).toBeDefined()
})

it('should add color', () => {
  const start = addRandomNodeColors(
    addRandomNodeColors(GraphModel.createEmpty(), 9)
  )
  const node = randomNode(start.getCurrentContent())
  expect(node?.color).toBeDefined()
})
