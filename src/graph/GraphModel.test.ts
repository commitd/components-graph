import { ContentModel } from './ContentModel'
import { DecoratorModel } from './DecoratorModel'
import { GraphModel } from './GraphModel'
import { LayoutModel } from './LayoutModel'
import { SelectionModel } from './SelectionModel'
import { GraphCommand, ModelEdge, ModelNode } from './types'

let graphModel: GraphModel

const node1: ModelNode = {
  id: 'node1',
  attributes: {
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

const node2: ModelNode = {
  id: 'node2',
  attributes: {
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

const edge1: ModelEdge = {
  id: 'edge1',
  attributes: {
    role: 'client',
  },
  source: node1.id,
  target: node2.id,
}

beforeEach(() => {
  graphModel = GraphModel.createEmpty()
})

it('Applies content changes', () => {
  expect(graphModel.nodes.length).toBe(0)
  expect(graphModel.edges.length).toBe(0)
  const newModel = GraphModel.applyContent(
    graphModel,
    graphModel.getCurrentContent().addNode(node1).addNode(node2).addEdge(edge1)
  )
  expect(newModel.nodes.length).toBe(2)
  expect(newModel.edges.length).toBe(1)
})

it('Selection change updates selected nodes', () => {
  const withDataSelected = GraphModel.applySelection(
    GraphModel.applyContent(
      graphModel,
      graphModel.getCurrentContent().addNode(node1).addNode(node2)
    ),
    new SelectionModel([node1.id, node2.id], [edge1.id])
  )
  expect(withDataSelected.selectedNodes.length).toBe(2)
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
  expect(withDataSelected.selectedEdges.length).toBe(1)
})

it('Removed nodes and edges are removed from selection', () => {
  expect(graphModel.selectedNodes.length).toBe(0)
  expect(graphModel.selectedEdges.length).toBe(0)
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
  expect(withDataSelected.selectedNodes.length).toBe(2)
  expect(withDataSelected.selectedEdges.length).toBe(1)
  const removedData = GraphModel.applyContent(
    withDataSelected,
    ContentModel.createEmpty()
  )
  expect(removedData.selectedNodes.length).toBe(0)
  expect(removedData.selectedEdges.length).toBe(0)
})

it('Selection of non-existing nodes and edges is ignored', () => {
  const newModel = GraphModel.applySelection(
    graphModel,
    new SelectionModel([node1.id, node2.id], [edge1.id])
  )
  expect(newModel.selectedNodes.length).toBe(0)
  expect(newModel.selectedEdges.length).toBe(0)
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
    }
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
  expect(model.clearCommands().getCommands().length).toBe(0)
})

it('Clearing empty queue does nothing', () => {
  expect(graphModel.clearCommands()).toBe(graphModel)
})
