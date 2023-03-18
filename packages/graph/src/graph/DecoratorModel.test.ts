import { DecoratorModel } from './DecoratorModel'
import {
  Edge,
  EdgeDecoration,
  EdgeDecorator,
  ModelEdge,
  ModelNode,
  Node,
  NodeDecoration,
  NodeDecorator,
} from './types'

let decoratorModel: DecoratorModel

const nodeWithoutDecoration: Node = {
  id: 'node1',
  metadata: {
    employer: 'Committed',
  },
}

const nodeWithDecoration: Node = {
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

const edgeWithoutDecoration: Edge = {
  id: 'edge1',
  metadata: {
    role: 'client',
  },
  source: 'node1',
  target: 'node2',
  directed: true,
}

const edgeWithDecoration: Edge = {
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
  curve: 'bezier',
}

const nodeDecorator: NodeDecorator = () => nodeDecoratorDecoration
const edgeDecorator: EdgeDecorator = () => edgeDecoratorDecoration

beforeEach(() => {
  decoratorModel = DecoratorModel.createDefault()
})

it('Create default sets default node decoration for light theme', () => {
  expect(decoratorModel.getDefaultNodeDecorator()()).toMatchInlineSnapshot(`
    {
      "color": "$colors$brandYellow9",
      "opacity": 1,
      "shape": "ellipse",
      "size": 25,
      "strokeColor": "$colors$textSecondary",
      "strokeSize": 2,
    }
  `)
})

it('Create default sets default node decoration for dark theme', () => {
  expect(decoratorModel.getDefaultNodeDecorator()()).toMatchInlineSnapshot(`
    {
      "color": "$colors$brandYellow9",
      "opacity": 1,
      "shape": "ellipse",
      "size": 25,
      "strokeColor": "$colors$textSecondary",
      "strokeSize": 2,
    }
  `)
})

it('Can supply partial decorator for default', () => {
  const decoration = DecoratorModel.createDefault({
    nodeDefaults: { color: '#123456', size: 10 },
  }).getDefaultNodeDecorator()()

  expect(decoration.color).toEqual('#123456')
  expect(decoration.size).toEqual(10)
  expect(decoration).toMatchInlineSnapshot(`
    {
      "color": "#123456",
      "opacity": 1,
      "shape": "ellipse",
      "size": 10,
      "strokeColor": "$colors$textSecondary",
      "strokeSize": 2,
    }
  `)
})

it('Returns item id as a label', () => {
  expect(DecoratorModel.idAsLabelNode(nodeWithoutDecoration).label).toBe(
    nodeWithDecoration.id
  )
})

it('Does not alter non-decoration node properties', () => {
  const decoratedNode = decoratorModel.getDecoratedNodes([
    nodeWithDecoration,
  ])[0]
  expect(decoratedNode.id).toBe(nodeWithDecoration.id)
  expect(decoratedNode.metadata).toBe(nodeWithDecoration.metadata)
})

it('Does not applies default decoration to unstyled node', () => {
  const decorationOverrides = decoratorModel
    .getDecoratedNodes([nodeWithoutDecoration])[0]
    .getDecorationOverrides()
  expect(decorationOverrides.color).toBeUndefined()
  expect(decorationOverrides.opacity).toBeUndefined()
  expect(decorationOverrides.shape).toBeUndefined()
  expect(decorationOverrides.size).toBeUndefined()
  expect(decorationOverrides.strokeColor).toBeUndefined()
  expect(decorationOverrides.strokeSize).toBeUndefined()
})

it('Node specific decoration overrides default decoration', () => {
  const decorationOverrides = decoratorModel
    .getDecoratedNodes([nodeWithDecoration])[0]
    .getDecorationOverrides()

  expect(decorationOverrides.color).toBe(nodeWithDecoration.color)
  expect(decorationOverrides.opacity).toBe(nodeWithDecoration.opacity)
  expect(decorationOverrides.shape).toBe(nodeWithDecoration.shape)
  expect(decorationOverrides.size).toBe(nodeWithDecoration.size)
  expect(decorationOverrides.strokeColor).toBe(nodeWithDecoration.strokeColor)
  expect(decorationOverrides.strokeSize).toBe(nodeWithDecoration.strokeSize)
})

it('Decorator node decoration overrides default decoration', () => {
  const decorationOverrides = DecoratorModel.createDefault({
    nodeDecorators: [nodeDecorator],
  })
    .getDecoratedNodes([nodeWithoutDecoration])[0]
    .getDecorationOverrides()

  expect(decorationOverrides.color).toBe(nodeDecoratorDecoration.color)
  expect(decorationOverrides.opacity).toBe(nodeDecoratorDecoration.opacity)
  expect(decorationOverrides.shape).toBe(nodeDecoratorDecoration.shape)
  expect(decorationOverrides.size).toBe(nodeDecoratorDecoration.size)
  expect(decorationOverrides.strokeColor).toBe(
    nodeDecoratorDecoration.strokeColor
  )
  expect(decorationOverrides.strokeSize).toBe(
    nodeDecoratorDecoration.strokeSize
  )
})

it('Node specific decoration overrides both decorator default decoration and decorator decoration', () => {
  const decorationOverrides = DecoratorModel.createDefault({
    nodeDecorators: [nodeDecorator],
  })
    .getDecoratedNodes([nodeWithDecoration])[0]
    .getDecorationOverrides()
  expect(decorationOverrides.color).toBe(nodeWithDecoration.color)
  expect(decorationOverrides.opacity).toBe(nodeWithDecoration.opacity)
  expect(decorationOverrides.shape).toBe(nodeWithDecoration.shape)
  expect(decorationOverrides.size).toBe(nodeWithDecoration.size)
  expect(decorationOverrides.strokeColor).toBe(nodeWithDecoration.strokeColor)
  expect(decorationOverrides.strokeSize).toBe(nodeWithDecoration.strokeSize)
})

it('Create default sets default edge decoration for theme', () => {
  expect(decoratorModel.getDefaultEdgeDecorator()()).toMatchInlineSnapshot(`
    {
      "color": "$colors$textSecondary",
      "curve": "haystack",
      "opacity": 1,
      "size": 2,
      "sourceArrow": false,
      "style": "solid",
      "targetArrow": false,
    }
  `)
})

it('Can supply partial decorator function for default', () => {
  const decoration = DecoratorModel.createDefault({
    edgeDefaults: () => ({
      color: '$colors$success',
      size: 10,
    }),
  }).getDefaultEdgeDecorator()()

  expect(decoration.color).toEqual('$colors$success')
  expect(decoration.size).toEqual(10)
  expect(decoration).toMatchInlineSnapshot(`
    {
      "color": "$colors$success",
      "curve": "haystack",
      "opacity": 1,
      "size": 10,
      "sourceArrow": false,
      "style": "solid",
      "targetArrow": false,
    }
  `)
})

it('Returns item id as a label', () => {
  expect(DecoratorModel.idAsLabelEdge(edgeWithoutDecoration).label).toBe(
    edgeWithoutDecoration.id
  )
})

it('Does not alter non-decoration edge properties', () => {
  const decoratedEdge = decoratorModel.getDecoratedEdges([
    edgeWithDecoration,
  ])[0]

  expect(decoratedEdge.id).toBe(edgeWithDecoration.id)
  expect(decoratedEdge.metadata).toBe(edgeWithDecoration.metadata)
  expect(decoratedEdge.source).toBe(edgeWithDecoration.source)
  expect(decoratedEdge.target).toBe(edgeWithDecoration.target)
})

it('Does not apply default decoration to unstyled edge', () => {
  const decorationOverrides = decoratorModel
    .getDecoratedEdges([edgeWithoutDecoration])[0]
    .getDecorationOverrides()

  expect(decorationOverrides.color).toBeUndefined()
  expect(decorationOverrides.opacity).toBeUndefined()
  expect(decorationOverrides.size).toBeUndefined()
  expect(decorationOverrides.sourceArrow).toBeUndefined()
  expect(decorationOverrides.targetArrow).toBeUndefined()
  expect(decorationOverrides.style).toBeUndefined()
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
  const decorationOverrides = decoratorModel
    .getDecoratedEdges([edgeWithDecoration])[0]
    .getDecorationOverrides()

  expect(decorationOverrides.color).toBe(edgeWithDecoration.color)
  expect(decorationOverrides.opacity).toBe(edgeWithDecoration.opacity)
  expect(decorationOverrides.size).toBe(edgeWithDecoration.size)
  expect(decorationOverrides.sourceArrow).toBe(edgeWithDecoration.sourceArrow)
  expect(decorationOverrides.targetArrow).toBe(edgeWithDecoration.targetArrow)
  expect(decorationOverrides.style).toBe(edgeWithDecoration.style)
})

it('Decorator edge decoration overrides default decoration', () => {
  const decorationOverrides = DecoratorModel.createDefault({
    edgeDecorators: [edgeDecorator],
  })
    .getDecoratedEdges([edgeWithoutDecoration])[0]
    .getDecorationOverrides()

  expect(decorationOverrides.color).toBe(edgeDecoratorDecoration.color)
  expect(decorationOverrides.opacity).toBe(edgeDecoratorDecoration.opacity)
  expect(decorationOverrides.size).toBe(edgeDecoratorDecoration.size)
  expect(decorationOverrides.sourceArrow).toBe(
    edgeDecoratorDecoration.sourceArrow
  )
  expect(decorationOverrides.targetArrow).toBe(
    edgeDecoratorDecoration.targetArrow
  )
  expect(decorationOverrides.style).toBe(edgeDecoratorDecoration.style)
})

it('Edge specific decoration overrides both decorator default decoration and decorator decoration', () => {
  const decorationOverrides = DecoratorModel.createDefault({
    edgeDecorators: [edgeDecorator],
  })
    .getDecoratedEdges([edgeWithDecoration])[0]
    .getDecorationOverrides()
  expect(decorationOverrides.color).toBe(edgeWithDecoration.color)
  expect(decorationOverrides.opacity).toBe(edgeWithDecoration.opacity)
  expect(decorationOverrides.size).toBe(edgeWithDecoration.size)
  expect(decorationOverrides.sourceArrow).toBe(edgeWithDecoration.sourceArrow)
  expect(decorationOverrides.targetArrow).toBe(edgeWithDecoration.targetArrow)
  expect(decorationOverrides.style).toBe(edgeWithDecoration.style)
})

it('Can add and remove node decorators', () => {
  let decorationOverrides = DecoratorModel.createDefault().addNodeDecorator(
    DecoratorModel.idAsLabelNode
  )

  expect(
    decorationOverrides.isNodeDecoratorSet(DecoratorModel.idAsLabelNode)
  ).toBe(true)

  decorationOverrides = decorationOverrides.removeNodeDecorator(
    DecoratorModel.idAsLabelNode
  )
  expect(
    decorationOverrides.isNodeDecoratorSet(DecoratorModel.idAsLabelNode)
  ).toBe(false)
})

it('Can add and remove edge decorators', () => {
  let decorationOverrides = DecoratorModel.createDefault().addEdgeDecorator(
    DecoratorModel.idAsLabelEdge
  )

  expect(
    decorationOverrides.isEdgeDecoratorSet(DecoratorModel.idAsLabelEdge)
  ).toBe(true)

  decorationOverrides = decorationOverrides.removeEdgeDecorator(
    DecoratorModel.idAsLabelEdge
  )
  expect(
    decorationOverrides.isEdgeDecoratorSet(DecoratorModel.idAsLabelEdge)
  ).toBe(false)
})

it('Can add decorator and remove node decorators by id', () => {
  const customDecorator: NodeDecorator = (_e: ModelNode) => ({})
  customDecorator.id = 'nodeDecorator'

  let decorationOverrides =
    DecoratorModel.createDefault().addNodeDecorator(customDecorator)

  expect(decorationOverrides.isNodeDecoratorSet(customDecorator)).toBe(true)
  expect(decorationOverrides.getNodeDecoratorIds()).toContain('nodeDecorator')

  decorationOverrides =
    decorationOverrides.removeNodeDecoratorById('nodeDecorator')
  expect(decorationOverrides.isNodeDecoratorSet(customDecorator)).toBe(false)
})

it('Can add decorator and remove edge decorators by id', () => {
  const customDecorator: EdgeDecorator = (_e: ModelEdge) => ({})
  customDecorator.id = 'edgeDecorator'

  let decorationOverrides =
    DecoratorModel.createDefault().addEdgeDecorator(customDecorator)

  expect(decorationOverrides.isEdgeDecoratorSet(customDecorator)).toBe(true)
  expect(decorationOverrides.getEdgeDecoratorIds()).toContain('edgeDecorator')

  decorationOverrides =
    decorationOverrides.removeEdgeDecoratorById('edgeDecorator')
  expect(decorationOverrides.isEdgeDecoratorSet(customDecorator)).toBe(false)
})

it('Removing missing decorator causes no error', () => {
  let decorationOverrides = DecoratorModel.createDefault()
    .removeNodeDecorator(DecoratorModel.idAsLabelNode)
    .removeNodeDecoratorById('test')
    .removeEdgeDecorator(DecoratorModel.idAsLabelEdge)
    .removeEdgeDecoratorById('test')

  expect(decorationOverrides.getNodeDecoratorIds()).toHaveLength(0)
  expect(decorationOverrides.getEdgeDecoratorIds()).toHaveLength(0)
})
