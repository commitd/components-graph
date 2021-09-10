import {
  DecoratedEdge,
  DecoratedNode,
  DecorationFunction,
  EdgeDecoration,
  EdgeDecorationFunction,
  EdgeDecorator,
  ItemDecoration,
  ModelEdge,
  ModelNode,
  NodeDecoration,
  NodeDecorationFunction,
  NodeDecorator,
} from './types'

export class DecoratorModel {
  static readonly DEFAULT_NODE_DECORATION: NodeDecoration = {
    shape: 'ellipse',
    color: '#FFc526',
    size: 25,
    opacity: 1,
    strokeColor: '#3E3E3E',
    strokeSize: 2,
  }

  static readonly DEFAULT_EDGE_DECORATION: EdgeDecoration = {
    color: '#FF0000',
    size: 2,
    sourceArrow: false,
    targetArrow: false,
    opacity: 1,
    style: 'solid',
  }

  static readonly idAsLabelNode: NodeDecorator = (item) => {
    return { label: item.id }
  }

  static readonly idAsLabelEdge: EdgeDecorator = (item) => {
    return { label: item.id }
  }

  static createDefault(
    options: {
      nodeDecorators?: NodeDecorator[]
      nodeDefaults?: Partial<NodeDecoration> | NodeDecorationFunction
      edgeDecorators?: EdgeDecorator[]
      edgeDefaults?: Partial<EdgeDecoration> | EdgeDecorationFunction
      hideNodeLabels?: boolean
      hideEdgeLabels?: boolean
    } = {}
  ): DecoratorModel {
    return new DecoratorModel(
      options.nodeDecorators ?? [],
      options.nodeDefaults ?? {},
      options.edgeDecorators ?? [],
      options.edgeDefaults ?? {},
      options.hideNodeLabels ?? false,
      options.hideEdgeLabels ?? false
    )
  }

  constructor(
    private readonly nodeDecorators: NodeDecorator[],
    private readonly nodeDefaults:
      | Partial<NodeDecoration>
      | NodeDecorationFunction,
    private readonly edgeDecorators: EdgeDecorator[],
    private readonly edgeDefaults:
      | Partial<EdgeDecoration>
      | EdgeDecorationFunction,
    private readonly nodeLabelsHidden: boolean,
    private readonly edgeLabelsHidden: boolean
  ) {
    this.nodeDecorators = nodeDecorators
    this.nodeDefaults = nodeDefaults
    this.edgeDecorators = edgeDecorators
    this.edgeDefaults = edgeDefaults
    this.nodeLabelsHidden = nodeLabelsHidden
    this.edgeLabelsHidden = edgeLabelsHidden
  }

  /**
   * Get the decoration that is applied to all nodes, before anything is overridden by decorators
   *
   * Use this to apply blanket styling to nodes to minimise the performance impact of per-node styling
   */
  getDefaultNodeDecorator(): DecorationFunction<
    NodeDecoration,
    NodeDecoration
  > {
    return () => ({
      ...DecoratorModel.DEFAULT_NODE_DECORATION,
      ...{
        strokeColor: '$colors$textSecondary',
        color: '$colors$brandYellow9',
      },
      ...DecoratorModel.wrapDecorator(this.nodeDefaults)(),
    })
  }

  /**
   * Get the decoration that is applied to all edges, before anything is overridden by decorators
   *
   * Use this to apply blanket styling to edges to minimise the performance impact of per-edge styling
   */
  getDefaultEdgeDecorator(): DecorationFunction<
    EdgeDecoration,
    EdgeDecoration
  > {
    return () => ({
      ...DecoratorModel.DEFAULT_EDGE_DECORATION,
      ...{
        color: '$colors$textSecondary',
      },
      ...DecoratorModel.wrapDecorator(this.edgeDefaults)(),
    })
  }

  /**
   * Adds a function to the given nodes that provides the decoration overrides for the node
   * @param modelNodes to be decorated
   */
  getDecoratedNodes(modelNodes: ModelNode[]): DecoratedNode[] {
    return Object.values(modelNodes).map((node) => {
      return {
        getDecorationOverrides: () => this.getNodeDecorationOverrides(node),
        ...node,
      }
    })
  }

  /**
   * Adds a function to the given edges that provides the decoration overrides for the edge
   * @param modelEdges to be decorated
   */
  getDecoratedEdges(modelEdges: ModelEdge[]): DecoratedEdge[] {
    return Object.values(modelEdges).map((edge) => {
      return {
        getDecorationOverrides: () => this.getEdgeDecorationOverrides(edge),
        ...edge,
      }
    })
  }

  /** Does the decorator already exist in the model. === equality is used */
  isNodeDecoratorSet(decorator: NodeDecorator): boolean {
    return this.isDecoratorSet<NodeDecorator>(decorator, this.nodeDecorators)
  }

  /** Add a new decorator */
  addNodeDecorator(decorator: NodeDecorator): DecoratorModel {
    return new DecoratorModel(
      this.addDecorator<NodeDecorator>(decorator, this.nodeDecorators),
      this.nodeDefaults,
      this.edgeDecorators,
      this.edgeDefaults,
      this.nodeLabelsHidden,
      this.edgeLabelsHidden
    )
  }

  /** Remove an existing decorator. === equality is used */
  removeNodeDecorator(decorator: NodeDecorator): DecoratorModel {
    return new DecoratorModel(
      this.removeDecorator<NodeDecorator>(decorator, this.nodeDecorators),
      this.nodeDefaults,
      this.edgeDecorators,
      this.edgeDefaults,
      this.nodeLabelsHidden,
      this.edgeLabelsHidden
    )
  }

  private getDecoratorIds<T extends NodeDecorator | EdgeDecorator>(
    decorators: T[]
  ): string[] {
    return decorators
      .map((decorator) => decorator.id)
      .filter((id) => id !== undefined) as string[]
  }

  getNodeDecoratorIds(): string[] {
    return this.getDecoratorIds(this.nodeDecorators)
  }

  getEdgeDecoratorIds(): string[] {
    return this.getDecoratorIds(this.edgeDecorators)
  }

  private getDecoratorById<T extends NodeDecorator | EdgeDecorator>(
    decoratorId: string,
    decorators: T[]
  ): T | undefined {
    return decorators.find((decorator) => decorator.id === decoratorId)
  }

  removeNodeDecoratorById(decoratorId: string): DecoratorModel {
    const decorator = this.getDecoratorById(decoratorId, this.nodeDecorators)
    if (decorator === undefined) {
      return this
    } else {
      return new DecoratorModel(
        this.removeDecorator<NodeDecorator>(decorator, this.nodeDecorators),
        this.nodeDefaults,
        this.edgeDecorators,
        this.edgeDefaults,
        this.nodeLabelsHidden,
        this.edgeLabelsHidden
      )
    }
  }

  removeEdgeDecoratorById(decoratorId: string): DecoratorModel {
    const decorator = this.getDecoratorById(decoratorId, this.edgeDecorators)
    if (decorator === undefined) {
      return this
    } else {
      return new DecoratorModel(
        this.nodeDecorators,
        this.nodeDefaults,
        this.removeDecorator<EdgeDecorator>(decorator, this.edgeDecorators),
        this.edgeDefaults,
        this.nodeLabelsHidden,
        this.edgeLabelsHidden
      )
    }
  }

  /** Toggle a decorator on or off */
  toggleNodeDecorator(decorator: NodeDecorator): DecoratorModel {
    if (this.isNodeDecoratorSet(decorator)) {
      return this.removeNodeDecorator(decorator)
    } else {
      return this.addNodeDecorator(decorator)
    }
  }

  /** Does the decorator already exist in the model. === equality is used */
  isEdgeDecoratorSet(decorator: EdgeDecorator): boolean {
    return this.isDecoratorSet<EdgeDecorator>(decorator, this.edgeDecorators)
  }

  /** Add a new decorator */
  addEdgeDecorator(decorator: EdgeDecorator): DecoratorModel {
    return new DecoratorModel(
      this.nodeDecorators,
      this.nodeDefaults,
      this.addDecorator<EdgeDecorator>(decorator, this.edgeDecorators),
      this.edgeDefaults,
      this.nodeLabelsHidden,
      this.edgeLabelsHidden
    )
  }

  /** Remove an existing decorator. === equality is used */
  removeEdgeDecorator(decorator: EdgeDecorator): DecoratorModel {
    return new DecoratorModel(
      this.nodeDecorators,
      this.nodeDefaults,
      this.removeDecorator<EdgeDecorator>(decorator, this.edgeDecorators),
      this.edgeDefaults,
      this.nodeLabelsHidden,
      this.edgeLabelsHidden
    )
  }

  /** Toggle a decorator on or off */
  toggleEdgeDecorator(decorator: EdgeDecorator): DecoratorModel {
    if (this.isEdgeDecoratorSet(decorator)) {
      return this.removeEdgeDecorator(decorator)
    } else {
      return this.addEdgeDecorator(decorator)
    }
  }

  hideNodeLabels(hide: boolean): DecoratorModel {
    return new DecoratorModel(
      this.nodeDecorators,
      this.nodeDefaults,
      this.edgeDecorators,
      this.edgeDefaults,
      hide,
      this.edgeLabelsHidden
    )
  }

  hideEdgeLabels(hide: boolean): DecoratorModel {
    return new DecoratorModel(
      this.nodeDecorators,
      this.nodeDefaults,
      this.edgeDecorators,
      this.edgeDefaults,
      this.nodeLabelsHidden,
      hide
    )
  }

  isHideNodeLabels(): boolean {
    return this.nodeLabelsHidden
  }

  isHideEdgeLabels(): boolean {
    return this.edgeLabelsHidden
  }

  private isDecoratorSet<T extends NodeDecorator | EdgeDecorator>(
    decorator: T,
    decorators: T[]
  ): boolean {
    return decorators.includes(decorator)
  }

  private addDecorator<T extends NodeDecorator | EdgeDecorator>(
    decorator: T,
    decorators: T[]
  ): T[] {
    if (this.isDecoratorSet(decorator, decorators)) {
      return decorators
    }
    return decorators.concat([decorator])
  }

  private removeDecorator<T extends NodeDecorator | EdgeDecorator>(
    decorator: T,
    decorators: T[]
  ): T[] {
    if (!this.isDecoratorSet(decorator, decorators)) {
      return decorators
    }
    return decorators.filter((d) => d !== decorator)
  }

  private getNodeDecorationOverrides(node: ModelNode): Partial<NodeDecoration> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, attributes, ...nodeStyle } = node
    const decor = Object.assign(
      {},
      ...this.nodeDecorators.map((d) => d(node))
    ) as Partial<NodeDecoration>
    const labelOverride = this.nodeLabelsHidden ? { label: '' } : undefined
    return {
      ...decor,
      ...nodeStyle,
      ...labelOverride,
    }
  }

  private getEdgeDecorationOverrides(edge: ModelEdge): Partial<EdgeDecoration> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, attributes, source, target, ...edgeStyle } = edge
    const decor = Object.assign(
      {},
      ...this.edgeDecorators.map((d) => d(edge))
    ) as Partial<EdgeDecoration>
    const labelOverride = this.edgeLabelsHidden ? { label: '' } : undefined
    return {
      ...decor,
      ...edgeStyle,
      ...labelOverride,
    }
  }

  private static isFunction<T extends ItemDecoration>(
    decorator: Partial<T> | DecorationFunction<T>
  ): decorator is DecorationFunction<T> {
    return typeof decorator === 'function'
  }

  private static wrapDecorator<T extends ItemDecoration>(
    decorator: Partial<T> | DecorationFunction<T>
  ): DecorationFunction<T> {
    if (DecoratorModel.isFunction(decorator)) {
      return decorator
    } else {
      return () => decorator
    }
  }
}
