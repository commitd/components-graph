import { createCommittedThemes, Theme } from '@committed/components'
import { DecoratorModel } from './DecoratorModel'
import {
  EdgeDecoration,
  EdgeDecorator,
  ModelEdge,
  ModelNode,
  NodeDecoration,
  NodeDecorator,
} from './types'

const themes = createCommittedThemes()

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

it('Create default sets default node decoration for light theme', () => {
  expect(decoratorModel.getDefaultNodeDecorator()(themes.light))
    .toMatchInlineSnapshot(`
    Object {
      "color": "#FFBB00",
      "label": "",
      "opacity": 1,
      "shape": "ellipse",
      "size": 25,
      "strokeColor": "#515151",
      "strokeSize": 2,
    }
  `)
})

it('Create default sets default node decoration for dark theme', () => {
  expect(decoratorModel.getDefaultNodeDecorator()(themes.dark))
    .toMatchInlineSnapshot(`
    Object {
      "color": "#FFBB00",
      "label": "",
      "opacity": 1,
      "shape": "ellipse",
      "size": 25,
      "strokeColor": "#E1E1E1",
      "strokeSize": 2,
    }
  `)
})

it('Can supply partial decorator for default', () => {
  const decoration = DecoratorModel.createDefault({
    nodeDefaults: { color: '#123456', size: 10 },
  }).getDefaultNodeDecorator()(themes.light)

  expect(decoration.color).toEqual('#123456')
  expect(decoration.size).toEqual(10)
  expect(decoration).toMatchInlineSnapshot(`
      Object {
        "color": "#123456",
        "label": "",
        "opacity": 1,
        "shape": "ellipse",
        "size": 10,
        "strokeColor": "#515151",
        "strokeSize": 2,
      }
  `)
})

it('Returns item id as a label', () => {
  expect(
    DecoratorModel.idAsLabelNode(nodeWithoutDecoration, themes.light).label
  ).toBe(nodeWithDecoration.id)
})

it('Does not alter non-decoration node properties', () => {
  const decoratedNode = decoratorModel.getDecoratedNodes([
    nodeWithDecoration,
  ])[0]
  expect(decoratedNode.id).toBe(nodeWithDecoration.id)
  expect(decoratedNode.attributes).toBe(nodeWithDecoration.attributes)
})

it('Does not applies default decoration to unstyled node', () => {
  const decorationOverrides = decoratorModel
    .getDecoratedNodes([nodeWithoutDecoration])[0]
    .getDecorationOverrides(themes.light)
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
    .getDecorationOverrides(themes.light)

  expect(decorationOverrides.color).toBe(nodeWithDecoration.color)
  expect(decorationOverrides.opacity).toBe(nodeWithDecoration.opacity)
  expect(decorationOverrides.shape).toBe(nodeWithDecoration.shape)
  expect(decorationOverrides.size).toBe(nodeWithDecoration.size)
  expect(decorationOverrides.strokeColor).toBe(nodeWithDecoration.strokeColor)
  expect(decorationOverrides.strokeSize).toBe(nodeWithDecoration.strokeSize)
})

it('Includes node specific decoration in node decoration overrides', () => {
  const decorationOverrides = decoratorModel
    .getDecoratedNodes([nodeWithDecoration])[0]
    .getDecorationOverrides(themes.light)

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
    .getDecorationOverrides(themes.light)

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

it('Includes decorator decoration in node decoration overrides', () => {
  const decorationOverrides = DecoratorModel.createDefault({
    nodeDecorators: [nodeDecorator],
  })
    .getDecoratedNodes([nodeWithoutDecoration])[0]
    .getDecorationOverrides(themes.light)

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
    .getDecorationOverrides(themes.light)
  expect(decorationOverrides.color).toBe(nodeWithDecoration.color)
  expect(decorationOverrides.opacity).toBe(nodeWithDecoration.opacity)
  expect(decorationOverrides.shape).toBe(nodeWithDecoration.shape)
  expect(decorationOverrides.size).toBe(nodeWithDecoration.size)
  expect(decorationOverrides.strokeColor).toBe(nodeWithDecoration.strokeColor)
  expect(decorationOverrides.strokeSize).toBe(nodeWithDecoration.strokeSize)
})

it('Create default sets default edge decoration for light theme', () => {
  expect(decoratorModel.getDefaultEdgeDecorator()(themes.light))
    .toMatchInlineSnapshot(`
    Object {
      "color": "#515151",
      "label": "",
      "opacity": 1,
      "size": 2,
      "sourceArrow": false,
      "style": "solid",
      "targetArrow": false,
    }
  `)
})

it('Create default sets default edge decoration for dark theme', () => {
  expect(decoratorModel.getDefaultEdgeDecorator()(themes.dark))
    .toMatchInlineSnapshot(`
    Object {
      "color": "#E1E1E1",
      "label": "",
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
    edgeDefaults: (theme: Theme) => ({
      color: theme.palette.info.light,
      size: 10,
    }),
  }).getDefaultEdgeDecorator()(themes.light)

  expect(decoration.color).toEqual(themes.light.palette.info.light)
  expect(decoration.size).toEqual(10)
  expect(decoration).toMatchInlineSnapshot(`
    Object {
      "color": "#B3ECFF",
      "label": "",
      "opacity": 1,
      "size": 10,
      "sourceArrow": false,
      "style": "solid",
      "targetArrow": false,
    }
  `)
})

it('Returns item id as a label', () => {
  expect(
    DecoratorModel.idAsLabelNodeEdge(edgeWithoutDecoration, themes.light).label
  ).toBe(edgeWithoutDecoration.id)
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

it('Does not apply default decoration to unstyled edge', () => {
  const decorationOverrides = decoratorModel
    .getDecoratedEdges([edgeWithoutDecoration])[0]
    .getDecorationOverrides(themes.light)

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
    .getDecorationOverrides(themes.light)

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
    .getDecorationOverrides(themes.light)

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

it('Includes decorator decoration in edge decoration overrides', () => {
  const decorationOverrides = DecoratorModel.createDefault({
    edgeDecorators: [edgeDecorator],
  })
    .getDecoratedEdges([edgeWithoutDecoration])[0]
    .getDecorationOverrides(themes.light)

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
    .getDecorationOverrides(themes.light)
  expect(decorationOverrides.color).toBe(edgeWithDecoration.color)
  expect(decorationOverrides.opacity).toBe(edgeWithDecoration.opacity)
  expect(decorationOverrides.size).toBe(edgeWithDecoration.size)
  expect(decorationOverrides.sourceArrow).toBe(edgeWithDecoration.sourceArrow)
  expect(decorationOverrides.targetArrow).toBe(edgeWithDecoration.targetArrow)
  expect(decorationOverrides.style).toBe(edgeWithDecoration.style)
})
