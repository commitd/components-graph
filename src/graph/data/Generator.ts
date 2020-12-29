import { ContentModel } from '../ContentModel'
import { GraphModel } from '../GraphModel'
import { ModelEdge, ModelNode, NodeShape } from '../types'
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
  return shapes[Math.floor(Math.random() * shapes.length)]
}

const randomName = (): string => {
  return `${randomItem(names)} ${randomItem(names)}`
}

export const addRandomNode = (
  model: GraphModel,
  count = 1,
  options?: Partial<ModelNode> | (() => Partial<ModelNode>)
): GraphModel => {
  let content = model.getCurrentContent()
  for (let i = 0; i < count; i++) {
    content = content.addNode({
      label: randomName(),
      ...(typeof options === 'function' ? options() : options),
    })
  }
  return GraphModel.applyContent(model, content)
}

export const addRandomNodeShapes = (
  model: GraphModel,
  count = 1
): GraphModel => {
  return addRandomNode(model, count, () => ({
    shape: randomShape() as NodeShape,
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
