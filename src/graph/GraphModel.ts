import { ContentModel } from './ContentModel'
import { DecoratorModel } from './DecoratorModel'
import { LayoutModel } from './LayoutModel'
import { SelectionModel } from './SelectionModel'
import { DecoratedEdge, DecoratedNode } from './types'

export class GraphModel {
  private readonly contentModel: ContentModel
  private readonly selectionModel: SelectionModel
  private readonly decoratorModel: DecoratorModel
  private readonly layoutModel: LayoutModel

  constructor(
    contentModel: ContentModel,
    options: {
      selectionModel?: SelectionModel
      decoratorModel?: DecoratorModel
      layoutModel?: LayoutModel
    } = {}
  ) {
    this.contentModel = contentModel
    this.decoratorModel =
      options.decoratorModel ?? DecoratorModel.createDefault()
    this.layoutModel = options.layoutModel ?? LayoutModel.createDefault()
    this.selectionModel =
      options.selectionModel ?? SelectionModel.createDefault()
  }

  static applyContent(
    graphModel: GraphModel,
    contentModel: ContentModel
  ): GraphModel {
    return new GraphModel(contentModel, {
      decoratorModel: graphModel.decoratorModel,
      layoutModel: graphModel.layoutModel,
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
      decoratorModel: graphModel.decoratorModel,
      layoutModel: graphModel.layoutModel,
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
      decoratorModel: graphModel.decoratorModel,
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
      Array.from(this.getSelection().nodes).map(
        (n) => this.contentModel.nodes[n]
      )
    )
  }

  get selectedEdges(): DecoratedEdge[] {
    return this.decoratorModel.getDecoratedEdges(
      Array.from(this.getSelection().edges).map(
        (e) => this.contentModel.edges[e]
      )
    )
  }

  getNode(id: string): DecoratedNode {
    return this.decoratorModel.getDecoratedNodes([
      this.contentModel.getNode(id),
    ])[0]
  }

  getEdge(id: string): DecoratedEdge {
    return this.decoratorModel.getDecoratedEdges([
      this.contentModel.getEdge(id),
    ])[0]
  }

  getCurrentLayout(): LayoutModel {
    return this.layoutModel
  }

  getSelection(): SelectionModel {
    return this.selectionModel
  }

  private static reconcileSelection(
    contentModel: ContentModel,
    selectionModel: SelectionModel
  ): SelectionModel {
    const nodes = Array.from(selectionModel.nodes).filter(
      (n) => contentModel.nodes[n] != null
    )
    const edges = Array.from(selectionModel.edges).filter(
      (n) => contentModel.edges[n] != null
    )
    return new SelectionModel(nodes, edges)
  }
}
