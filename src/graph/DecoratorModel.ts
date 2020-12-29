import { colors, Theme } from '@committed/components'
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
    label: '',
    size: 25,
    opacity: 1,
    strokeColor: '#3E3E3E',
    strokeSize: 2,
  }

  static readonly DEFAULT_EDGE_DECORATION: EdgeDecoration = {
    color: '#FF0000',
    size: 2,
    label: '',
    sourceArrow: false,
    targetArrow: false,
    opacity: 1,
    style: 'solid',
  }

  static readonly idAsLabelNode: NodeDecorator = (item) => {
    return { label: item.id }
  }

  static readonly idAsLabelNodeEdge: EdgeDecorator = (item) => {
    return { label: item.id }
  }

  static createDefault(
    options: {
      nodeDecorators?: NodeDecorator[]
      nodeDefaults?: Partial<NodeDecoration> | NodeDecorationFunction
      edgeDecorators?: EdgeDecorator[]
      edgeDefaults?: Partial<EdgeDecoration> | EdgeDecorationFunction
    } = {}
  ): DecoratorModel {
    return new DecoratorModel(
      options.nodeDecorators ?? [],
      options.nodeDefaults ?? {},
      options.edgeDecorators ?? [],
      options.edgeDefaults ?? {}
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
      | EdgeDecorationFunction
  ) {
    this.nodeDecorators = nodeDecorators
    this.nodeDefaults = nodeDefaults
    this.edgeDecorators = edgeDecorators
    this.edgeDefaults = edgeDefaults
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
    return (theme: Theme) => ({
      ...DecoratorModel.DEFAULT_NODE_DECORATION,
      ...{
        strokeColor: theme.palette.text.secondary,
        color: colors.committedYellow[500],
      },
      ...DecoratorModel.wrapDecorator(this.nodeDefaults)(theme),
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
    return (theme: Theme) => ({
      ...DecoratorModel.DEFAULT_EDGE_DECORATION,
      ...{
        color: theme.palette.text.secondary,
      },
      ...DecoratorModel.wrapDecorator(this.edgeDefaults)(theme),
    })
  }

  /**
   * Adds a function to the given nodes that provides the decoration overrides for the node
   * @param modelNodes to be decorated
   */
  getDecoratedNodes(modelNodes: ModelNode[]): DecoratedNode[] {
    return Object.values(modelNodes).map((node) => {
      return {
        getDecorationOverrides: (theme: Theme) => ({
          ...this.getNodeDecorationOverrides(node, theme),
        }),
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
        getDecorationOverrides: (theme: Theme) => ({
          ...this.getEdgeDecorationOverrides(edge, theme),
        }),
        ...edge,
      }
    })
  }

  private getNodeDecorationOverrides(
    node: ModelNode,
    theme: Theme
  ): Partial<NodeDecoration> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, attributes, ...nodeStyle } = node
    const decor = Object.assign(
      {},
      ...this.nodeDecorators.map((d) => d(node, theme))
    ) as Partial<NodeDecoration>
    return {
      ...decor,
      ...nodeStyle,
    }
  }

  private getEdgeDecorationOverrides(
    edge: ModelEdge,
    theme: Theme
  ): Partial<EdgeDecoration> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, attributes, source, target, ...edgeStyle } = edge
    const decor = Object.assign(
      {},
      ...this.edgeDecorators.map((d) => d(edge, theme))
    ) as Partial<EdgeDecoration>
    return {
      ...decor,
      ...edgeStyle,
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
