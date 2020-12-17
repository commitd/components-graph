import { DecoratorModel } from './DecoratorModel'
import {
  EdgeDecoration,
  EdgeDecorator,
  ModelEdge,
  ModelNode,
  NodeDecoration,
  NodeDecorator,
} from './types'

let decoratorModel: DecoratorModel

const nodeWithoutDecoration: ModelNode = {
  id: 'node1',
  attributes: {
    employer: 'Committed',
  },
}

const nodeWithDecoration: ModelNode = {
  ...nodeWithoutDecoration,
  color: 'yellow',
  label: 'Node 1',
  size: 10,
  strokeColor: 'black',
  opacity: 1,
  shape: 'ellipse',
  strokeSize: 2,
}

const nodeDecoratorDecoration: NodeDecoration = {
  color: 'blue',
  label: 'decorated',
  size: 123,
  strokeColor: 'orange',
  opacity: 0.5,
  shape: 'diamond',
  strokeSize: 5,
}

const edgeWithoutDecoration: ModelEdge = {
  id: 'edge1',
  attributes: {
    role: 'client',
  },
  source: 'node1',
  target: 'node2',
}

const edgeWithDecoration: ModelEdge = {
  ...edgeWithoutDecoration,
  color: 'yellow',
  label: 'Node 1',
  size: 10,
  opacity: 1,
  sourceArrow: true,
  targetArrow: true,
  style: 'solid',
}

const edgeDecoratorDecoration: EdgeDecoration = {
  color: 'blue',
  label: 'decorated',
  size: 123,
  opacity: 0.5,
  sourceArrow: false,
  targetArrow: false,
  style: 'dashed',
}

const nodeDecorator: NodeDecorator = () => nodeDecoratorDecoration
const edgeDecorator: EdgeDecorator = () => edgeDecoratorDecoration

beforeEach(() => {
  decoratorModel = DecoratorModel.createDefault()
})

it('Create default sets default node decoration', () => {
  expect(decoratorModel.getNodeDefaults()).toBe(
    DecoratorModel.DEFAULT_NODE_DECORATION
  )
})

it('Does not alter non-decoration node properties', () => {
  const decoratedNode = decoratorModel.getDecoratedNodes([
    nodeWithDecoration,
  ])[0]
  expect(decoratedNode.id).toBe(nodeWithDecoration.id)
  expect(decoratedNode.attributes).toBe(nodeWithDecoration.attributes)
})

it('Applies default decoration to unstyled node', () => {
  const decoratedNode = decoratorModel.getDecoratedNodes([
    nodeWithoutDecoration,
  ])[0]
  expect(decoratedNode.color).toBe(DecoratorModel.DEFAULT_NODE_DECORATION.color)
  expect(decoratedNode.opacity).toBe(
    DecoratorModel.DEFAULT_NODE_DECORATION.opacity
  )
  expect(decoratedNode.shape).toBe(DecoratorModel.DEFAULT_NODE_DECORATION.shape)
  expect(decoratedNode.size).toBe(DecoratorModel.DEFAULT_NODE_DECORATION.size)
  expect(decoratedNode.strokeColor).toBe(
    DecoratorModel.DEFAULT_NODE_DECORATION.strokeColor
  )
  expect(decoratedNode.strokeSize).toBe(
    DecoratorModel.DEFAULT_NODE_DECORATION.strokeSize
  )
})

it('Node specific decoration overrides default decoration', () => {
  const decoratedNode = decoratorModel.getDecoratedNodes([
    nodeWithDecoration,
  ])[0]
  expect(decoratedNode.color).toBe(nodeWithDecoration.color)
  expect(decoratedNode.opacity).toBe(nodeWithDecoration.opacity)
  expect(decoratedNode.shape).toBe(nodeWithDecoration.shape)
  expect(decoratedNode.size).toBe(nodeWithDecoration.size)
  expect(decoratedNode.strokeColor).toBe(nodeWithDecoration.strokeColor)
  expect(decoratedNode.strokeSize).toBe(nodeWithDecoration.strokeSize)
})

it('Includes node specific decoration in node decoration overrides', () => {
  const overrides = decoratorModel.getNodeDecorationOverrides(
    nodeWithDecoration
  )
  expect(overrides.color).toBe(nodeWithDecoration.color)
  expect(overrides.opacity).toBe(nodeWithDecoration.opacity)
  expect(overrides.shape).toBe(nodeWithDecoration.shape)
  expect(overrides.size).toBe(nodeWithDecoration.size)
  expect(overrides.strokeColor).toBe(nodeWithDecoration.strokeColor)
  expect(overrides.strokeSize).toBe(nodeWithDecoration.strokeSize)
})

it('Decorator node decoration overrides default decoration', () => {
  const decoratedNode = DecoratorModel.createDefault({
    nodeDecorators: [nodeDecorator],
  }).getDecoratedNodes([nodeWithoutDecoration])[0]
  expect(decoratedNode.color).toBe(nodeDecoratorDecoration.color)
  expect(decoratedNode.opacity).toBe(nodeDecoratorDecoration.opacity)
  expect(decoratedNode.shape).toBe(nodeDecoratorDecoration.shape)
  expect(decoratedNode.size).toBe(nodeDecoratorDecoration.size)
  expect(decoratedNode.strokeColor).toBe(nodeDecoratorDecoration.strokeColor)
  expect(decoratedNode.strokeSize).toBe(nodeDecoratorDecoration.strokeSize)
})

it('Includes decorator decoration in node decoration overrides', () => {
  const overrides = DecoratorModel.createDefault({
    nodeDecorators: [nodeDecorator],
  }).getNodeDecorationOverrides(nodeWithoutDecoration)

  expect(overrides.color).toBe(nodeDecoratorDecoration.color)
  expect(overrides.opacity).toBe(nodeDecoratorDecoration.opacity)
  expect(overrides.shape).toBe(nodeDecoratorDecoration.shape)
  expect(overrides.size).toBe(nodeDecoratorDecoration.size)
  expect(overrides.strokeColor).toBe(nodeDecoratorDecoration.strokeColor)
  expect(overrides.strokeSize).toBe(nodeDecoratorDecoration.strokeSize)
})

it('Node specific decoration overrides both decorator default decoration and decorator decoration', () => {
  const decoratedNode = DecoratorModel.createDefault({
    nodeDecorators: [nodeDecorator],
  }).getDecoratedNodes([nodeWithDecoration])[0]
  expect(decoratedNode.color).toBe(nodeWithDecoration.color)
  expect(decoratedNode.opacity).toBe(nodeWithDecoration.opacity)
  expect(decoratedNode.shape).toBe(nodeWithDecoration.shape)
  expect(decoratedNode.size).toBe(nodeWithDecoration.size)
  expect(decoratedNode.strokeColor).toBe(nodeWithDecoration.strokeColor)
  expect(decoratedNode.strokeSize).toBe(nodeWithDecoration.strokeSize)
})

it('Create default sets default edge decoration', () => {
  expect(decoratorModel.getEdgeDefaults()).toBe(
    DecoratorModel.DEFAULT_EDGE_DECORATION
  )
})

it('Does not alter non-decoration edge properties', () => {
  const decoratedEdge = decoratorModel.getDecoratedEdges([
    edgeWithDecoration,
  ])[0]
  expect(decoratedEdge.id).toBe(edgeWithDecoration.id)
  expect(decoratedEdge.attributes).toBe(edgeWithDecoration.attributes)
  expect(decoratedEdge.source).toBe(edgeWithDecoration.source)
  expect(decoratedEdge.target).toBe(edgeWithDecoration.target)
})

it('Applies default decoration to unstyled edge', () => {
  const decoratedEdge = decoratorModel.getDecoratedEdges([
    edgeWithoutDecoration,
  ])[0]
  expect(decoratedEdge.color).toBe(DecoratorModel.DEFAULT_EDGE_DECORATION.color)
  expect(decoratedEdge.opacity).toBe(
    DecoratorModel.DEFAULT_EDGE_DECORATION.opacity
  )
  expect(decoratedEdge.size).toBe(DecoratorModel.DEFAULT_EDGE_DECORATION.size)
  expect(decoratedEdge.sourceArrow).toBe(
    DecoratorModel.DEFAULT_EDGE_DECORATION.sourceArrow
  )
  expect(decoratedEdge.targetArrow).toBe(
    DecoratorModel.DEFAULT_EDGE_DECORATION.targetArrow
  )
  expect(decoratedEdge.style).toBe(DecoratorModel.DEFAULT_EDGE_DECORATION.style)
})

it('Edge specific decoration overrides default decoration', () => {
  const decoratedEdge = decoratorModel.getDecoratedEdges([
    edgeWithDecoration,
  ])[0]
  expect(decoratedEdge.color).toBe(edgeWithDecoration.color)
  expect(decoratedEdge.opacity).toBe(edgeWithDecoration.opacity)
  expect(decoratedEdge.size).toBe(edgeWithDecoration.size)
  expect(decoratedEdge.sourceArrow).toBe(edgeWithDecoration.sourceArrow)
  expect(decoratedEdge.targetArrow).toBe(edgeWithDecoration.targetArrow)
  expect(decoratedEdge.style).toBe(edgeWithDecoration.style)
})

it('Includes edge specific decoration in edge decoration overrides', () => {
  const overrides = decoratorModel.getEdgeDecorationOverrides(
    edgeWithDecoration
  )
  expect(overrides.color).toBe(edgeWithDecoration.color)
  expect(overrides.opacity).toBe(edgeWithDecoration.opacity)
  expect(overrides.size).toBe(edgeWithDecoration.size)
  expect(overrides.sourceArrow).toBe(edgeWithDecoration.sourceArrow)
  expect(overrides.targetArrow).toBe(edgeWithDecoration.targetArrow)
  expect(overrides.style).toBe(edgeWithDecoration.style)
})

it('Decorator edge decoration overrides default decoration', () => {
  const decoratedEdge = DecoratorModel.createDefault({
    edgeDecorators: [edgeDecorator],
  }).getDecoratedEdges([edgeWithoutDecoration])[0]
  expect(decoratedEdge.color).toBe(edgeDecoratorDecoration.color)
  expect(decoratedEdge.opacity).toBe(edgeDecoratorDecoration.opacity)
  expect(decoratedEdge.size).toBe(edgeDecoratorDecoration.size)
  expect(decoratedEdge.sourceArrow).toBe(edgeDecoratorDecoration.sourceArrow)
  expect(decoratedEdge.targetArrow).toBe(edgeDecoratorDecoration.targetArrow)
  expect(decoratedEdge.style).toBe(edgeDecoratorDecoration.style)
})

it('Includes decorator decoration in edge decoration overrides', () => {
  const overrides = DecoratorModel.createDefault({
    edgeDecorators: [edgeDecorator],
  }).getEdgeDecorationOverrides(edgeWithoutDecoration)

  expect(overrides.color).toBe(edgeDecoratorDecoration.color)
  expect(overrides.opacity).toBe(edgeDecoratorDecoration.opacity)
  expect(overrides.size).toBe(edgeDecoratorDecoration.size)
  expect(overrides.sourceArrow).toBe(edgeDecoratorDecoration.sourceArrow)
  expect(overrides.targetArrow).toBe(edgeDecoratorDecoration.targetArrow)
  expect(overrides.style).toBe(edgeDecoratorDecoration.style)
})

it('Edge specific decoration overrides both decorator default decoration and decorator decoration', () => {
  const decoratedEdge = DecoratorModel.createDefault({
    edgeDecorators: [edgeDecorator],
  }).getDecoratedEdges([edgeWithDecoration])[0]
  expect(decoratedEdge.color).toBe(edgeWithDecoration.color)
  expect(decoratedEdge.opacity).toBe(edgeWithDecoration.opacity)
  expect(decoratedEdge.size).toBe(edgeWithDecoration.size)
  expect(decoratedEdge.sourceArrow).toBe(edgeWithDecoration.sourceArrow)
  expect(decoratedEdge.targetArrow).toBe(edgeWithDecoration.targetArrow)
  expect(decoratedEdge.style).toBe(edgeWithDecoration.style)
})
