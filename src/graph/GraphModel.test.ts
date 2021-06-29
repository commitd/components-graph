import { edge1, node1, node2, exampleGraph } from '../setupTests'
import { ContentModel } from './ContentModel'
import { DecoratorModel } from './DecoratorModel'
import { GraphModel } from './GraphModel'
import { LayoutModel } from './LayoutModel'
import { SelectionModel } from './SelectionModel'
import { GraphCommand } from './types'

let graphModel: GraphModel

beforeEach(() => {
  graphModel = GraphModel.createEmpty()
})

it('can access by id', () => {
  const graph = exampleGraph

  const decoratedNode = graph.getNode(node1.id)
  const decoratedEdge = graph.getEdge(edge1.id)
  // @ts-ignore
  delete decoratedNode['getDecorationOverrides']
  expect(decoratedNode).toEqual(node1)
  // @ts-ignore
  delete decoratedEdge['getDecorationOverrides']
  expect(decoratedEdge).toEqual(edge1)
})

it('missing returns undefined', () => {
  expect(graphModel.getNode('123')).toBeUndefined()
  expect(graphModel.getEdge('123')).toBeUndefined()
})

it('Applies content changes', () => {
  expect(graphModel.nodes).toHaveLength(0)
  expect(graphModel.edges).toHaveLength(0)
  const newModel = GraphModel.applyContent(
    graphModel,
    graphModel.getCurrentContent().addNode(node1).addNode(node2).addEdge(edge1)
  )
  expect(newModel.nodes).toHaveLength(2)
  expect(newModel.edges).toHaveLength(1)
})

it('Selection change updates selected nodes', () => {
  const withDataSelected = GraphModel.applySelection(
    GraphModel.applyContent(
      graphModel,
      graphModel.getCurrentContent().addNode(node1).addNode(node2)
    ),
    new SelectionModel([node1.id, node2.id], [edge1.id])
  )
  expect(withDataSelected.selectedNodes).toHaveLength(2)
})

it('Selection change updates selected edges', () => {
  const withDataSelected = GraphModel.applySelection(
    GraphModel.applyContent(
      graphModel,
      graphModel
        .getCurrentContent()
        .addNode(node1)
        .addNode(node2)
        .addEdge(edge1)
    ),
    new SelectionModel([node1.id, node2.id], [edge1.id])
  )
  expect(withDataSelected.selectedEdges).toHaveLength(1)
})

it('Removed nodes and edges are removed from selection', () => {
  expect(graphModel.selectedNodes).toHaveLength(0)
  expect(graphModel.selectedEdges).toHaveLength(0)
  const withDataSelected = GraphModel.applySelection(
    exampleGraph,
    new SelectionModel([node1.id, node2.id], [edge1.id])
  )
  expect(withDataSelected.selectedNodes).toHaveLength(2)
  expect(withDataSelected.selectedEdges).toHaveLength(1)
  const removedData = GraphModel.applyContent(
    withDataSelected,
    ContentModel.createEmpty()
  )
  expect(removedData.selectedNodes).toHaveLength(0)
  expect(removedData.selectedEdges).toHaveLength(0)
})

it('Selection of non-existing nodes and edges is ignored', () => {
  const newModel = GraphModel.applySelection(
    graphModel,
    new SelectionModel([node1.id, node2.id], [edge1.id])
  )
  expect(newModel.selectedNodes).toHaveLength(0)
  expect(newModel.selectedEdges).toHaveLength(0)
})

it('Applies layout', () => {
  const layout = 'circle'
  expect(
    GraphModel.applyLayout(graphModel, new LayoutModel(layout))
      .getCurrentLayout()
      .getLayout()
  ).toBe(layout)
})

it('Creating with content equivalent to applying it', () => {
  const content = graphModel
    .getCurrentContent()
    .addNode(node1)
    .addNode(node2)
    .addEdge(edge1)
  expect(GraphModel.createWithContent(content)).toStrictEqual(
    GraphModel.applyContent(graphModel, content)
  )
})

it('Gets latest content', () => {
  const content = graphModel
    .getCurrentContent()
    .addNode(node1)
    .addNode(node2)
    .addEdge(edge1)
  expect(
    GraphModel.applyContent(graphModel, content).getCurrentContent()
  ).toStrictEqual(content)
})

it('Gets latest decoration', () => {
  const decoratorModel = new DecoratorModel(
    [DecoratorModel.idAsLabelNode],
    {
      color: 'yellow',
      label: 'Node 1',
      size: 10,
      strokeColor: 'black',
      opacity: 1,
      shape: 'ellipse',
      strokeSize: 2,
    },
    [DecoratorModel.idAsLabelNodeEdge],
    {
      color: 'yellow',
      label: 'Node 1',
      size: 10,
      opacity: 1,
      sourceArrow: true,
      targetArrow: true,
      style: 'solid',
    },
    false,
    false
  )
  expect(
    new GraphModel(ContentModel.createEmpty(), {
      decoratorModel,
    }).getDecorators()
  ).toStrictEqual(decoratorModel)
})

it('Pushed commands are added to the end of the queue', () => {
  const model = new GraphModel(ContentModel.createEmpty(), {
    commandQueue: [{ type: 'Layout' }],
  })
  const command: GraphCommand = { type: 'ZoomIn' }
  const withCommand = model.pushCommand(command)
  expect(withCommand.getCommands()[withCommand.getCommands().length - 1]).toBe(
    command
  )
})

it('Clears commands', () => {
  const model = new GraphModel(ContentModel.createEmpty(), {
    commandQueue: [{ type: 'Layout' }],
  })
  expect(model.clearCommands().getCommands()).toHaveLength(0)
})

it('Clearing empty queue does nothing', () => {
  expect(graphModel.clearCommands()).toBe(graphModel)
})
