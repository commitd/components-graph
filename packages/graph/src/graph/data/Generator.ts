import { ContentModel } from '../ContentModel'
import { GraphModel } from '../GraphModel'
import { ModelEdge, ModelNode } from '../types'
import { colors } from './colors'
import { names } from './names'
import { shapes } from './shapes'

const randomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)] // nosonar - secure random not required

export const randomNode = (model: ContentModel): ModelNode | undefined => {
  const nodes = Object.values(model.nodes)
  if (nodes.length === 0) {
    return
  }
  return randomItem(nodes)
}

const randomNumber = (): number => Math.ceil(Math.random() * 100)

const randomEdge = (model: ContentModel): ModelEdge | undefined => {
  const edges = Object.values(model.edges)
  if (edges.length === 0) {
    return
  }
  return randomItem(edges)
}

const randomColor = (): string => {
  return randomItem(colors)
}

const randomShape = (): string => {
  return randomItem(shapes)
}

export const addRandomNode = (
  model: GraphModel,
  count = 1,
  options?: Partial<ModelNode> | (() => Partial<ModelNode>)
): GraphModel => {
  let content = model.getCurrentContent()
  for (let i = 0; i < count; i++) {
    const firstName = randomItem(names)
    const lastName = randomItem(names)
    const age = randomNumber()
    content = content.addNode({
      label: `${firstName} ${lastName}`,
      ...(typeof options === 'function' ? options() : options),
      attributes: {
        firstName,
        lastName,
        age,
      },
    })
  }
  return GraphModel.applyContent(model, content)
}

export const randomGraph = (nodes = 20, edges = 15): GraphModel => {
  return addRandomEdge(addRandomNode(GraphModel.createEmpty(), nodes), edges)
}

export const addRandomNodeShapes = (
  model: GraphModel,
  count = 1
): GraphModel => {
  return addRandomNode(model, count, () => ({
    shape: randomShape(),
  }))
}

export const addRandomNodeColors = (
  model: GraphModel,
  count = 1
): GraphModel => {
  return addRandomNode(model, count, () => ({
    color: randomColor(),
  }))
}

export const addRandomEdge = (model: GraphModel, count = 1): GraphModel => {
  if (model.nodes.length === 0) {
    return model
  }
  let content = model.getCurrentContent()
  for (let i = 0; i < count; i++) {
    const node1 = randomNode(content)
    const node2 = randomNode(content)
    if (node1 == null || node2 == null) {
      return model
    }
    content = content.addEdge({
      source: node1.id,
      target: node2.id,
      targetArrow: true,
      label: 'edge',
    })
  }
  return GraphModel.applyContent(model, content)
}

export const removeRandomNode = (model: GraphModel, count = 1): GraphModel => {
  let content = model.getCurrentContent()
  for (let i = 0; i < count; i++) {
    const node = randomNode(content)
    if (node == null) {
      return model
    }
    content = content.removeNode(node.id)
  }
  return GraphModel.applyContent(model, content)
}

export const removeRandomEdge = (model: GraphModel, count = 1): GraphModel => {
  let content = model.getCurrentContent()
  for (let i = 0; i < count; i++) {
    const edge = randomEdge(content)
    if (edge == null) {
      return model
    }
    content = content.removeEdge(edge.id)
  }
  return GraphModel.applyContent(model, content)
}
