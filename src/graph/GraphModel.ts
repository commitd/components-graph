import { ContentModel } from './ContentModel'
import { DecoratorModel } from './DecoratorModel'
import { LayoutModel } from './LayoutModel'
import { SelectionModel } from './SelectionModel'
import {
  DecoratedEdge,
  DecoratedNode,
  GraphCommand,
  ModelEdge,
  ModelNode,
} from './types'

/** The GraphModel is a declarative, immutable definition of graph state
 
The GraphModel defines:
- Nodes/edges (ContentModel)
	- No requirement for ontology, typing etc
	- Attributes
- Decoration (DecoratorModel)
	- May define custom node/edge Decorators based on any property on the node/edge
- Selection (SelectionModel)
	- Multi-select
- Graph layout (LayoutModel)
	- Force Layout / Cola JS
	- Circle
	- Grid
	- Custom (supplying a function)
- CommandQueue
	- Trigger behaviour from outside the GraphModel/React component
	- Current commands: zoom in/out, relayout, refit
 */
export class GraphModel {
  private readonly contentModel: ContentModel
  private readonly selectionModel: SelectionModel
  private readonly decoratorModel: DecoratorModel
  private readonly layoutModel: LayoutModel
  private readonly commandQueue: GraphCommand[]

  constructor(
    contentModel: ContentModel,
    options: {
      selectionModel?: SelectionModel
      decoratorModel?: DecoratorModel
      layoutModel?: LayoutModel
      commandQueue?: GraphCommand[]
    } = {}
  ) {
    this.contentModel = contentModel
    this.decoratorModel =
      options.decoratorModel ?? DecoratorModel.createDefault()
    this.layoutModel = options.layoutModel ?? LayoutModel.createDefault()
    this.selectionModel =
      options.selectionModel ?? SelectionModel.createDefault()
    this.commandQueue = options.commandQueue ?? []
  }

  static applyContent(
    graphModel: GraphModel,
    contentModel: ContentModel
  ): GraphModel {
    return new GraphModel(contentModel, {
      ...graphModel.getOptions(),
      selectionModel: GraphModel.reconcileSelection(
        contentModel,
        graphModel.getSelection()
      ),
    })
  }

  static applySelection(
    graphModel: GraphModel,
    selectionModel: SelectionModel
  ): GraphModel {
    return new GraphModel(graphModel.getCurrentContent(), {
      ...graphModel.getOptions(),
      selectionModel: GraphModel.reconcileSelection(
        graphModel.getCurrentContent(),
        selectionModel
      ),
    })
  }

  static applyLayout(
    graphModel: GraphModel,
    layoutModel: LayoutModel
  ): GraphModel {
    return new GraphModel(graphModel.contentModel, {
      ...graphModel.getOptions(),
      layoutModel,
      selectionModel: graphModel.getSelection(),
    })
  }

  static createEmpty(): GraphModel {
    return new GraphModel(ContentModel.createEmpty())
  }

  static createWithContent(contentModel: ContentModel): GraphModel {
    return new GraphModel(contentModel)
  }

  getCurrentContent(): ContentModel {
    return this.contentModel
  }

  getDecorators(): DecoratorModel {
    return this.decoratorModel
  }

  // get the current fully decorated nodes
  get nodes(): DecoratedNode[] {
    return this.decoratorModel.getDecoratedNodes(
      Object.values(this.contentModel.nodes)
    )
  }

  // get the current fully decorated edges
  get edges(): DecoratedEdge[] {
    return this.decoratorModel.getDecoratedEdges(
      Object.values(this.contentModel.edges)
    )
  }

  get selectedNodes(): DecoratedNode[] {
    return this.decoratorModel.getDecoratedNodes(
      Array.from(this.getSelection().nodes)
        .map((n) => this.contentModel.getNode(n))
        .filter((n) => n != null)
        .map((n) => n as ModelNode)
    )
  }

  get selectedEdges(): DecoratedEdge[] {
    return this.decoratorModel.getDecoratedEdges(
      Array.from(this.getSelection().edges)
        .map((e) => this.contentModel.getEdge(e))
        .filter((e) => e != null)
        .map((e) => e as ModelEdge)
    )
  }

  getNode(id: string): DecoratedNode | undefined {
    const node = this.contentModel.getNode(id)
    if (node == null) {
      return node
    }
    return this.decoratorModel.getDecoratedNodes([node])[0]
  }

  getEdge(id: string): DecoratedEdge | undefined {
    const edge = this.contentModel.getEdge(id)
    if (edge == null) {
      return edge
    }
    return this.decoratorModel.getDecoratedEdges([edge])[0]
  }

  getCurrentLayout(): LayoutModel {
    return this.layoutModel
  }

  getSelection(): SelectionModel {
    return this.selectionModel
  }

  getCommands(): GraphCommand[] {
    return this.commandQueue
  }

  pushCommand(command: GraphCommand): GraphModel {
    return new GraphModel(this.contentModel, {
      ...this.getOptions(),
      commandQueue: [...this.commandQueue, command],
    })
  }

  clearCommands(): GraphModel {
    if (this.commandQueue.length === 0) {
      return this
    }
    return new GraphModel(this.contentModel, {
      ...this.getOptions(),
      commandQueue: [],
    })
  }

  private getOptions(): {
    selectionModel: SelectionModel
    decoratorModel: DecoratorModel
    layoutModel: LayoutModel
    commandQueue: GraphCommand[]
  } {
    return {
      selectionModel: this.selectionModel,
      decoratorModel: this.decoratorModel,
      layoutModel: this.layoutModel,
      commandQueue: this.commandQueue,
    }
  }

  private static reconcileSelection(
    contentModel: ContentModel,
    selectionModel: SelectionModel
  ): SelectionModel {
    const nodes = Array.from(selectionModel.nodes).filter((n) =>
      contentModel.containsNode(n)
    )
    const edges = Array.from(selectionModel.edges).filter((n) =>
      contentModel.containsEdge(n)
    )
    return new SelectionModel(nodes, edges)
  }
}
