import {
  DecoratedEdge,
  DecoratedNode,
  EdgeDecoration,
  EdgeDecorator,
  ModelEdge,
  ModelNode,
  NodeDecoration,
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
    color: '#3E3E3E',
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
      nodeDefaults?: NodeDecoration
      edgeDecorators?: EdgeDecorator[]
      edgeDefaults?: EdgeDecoration
    } = {}
  ): DecoratorModel {
    return new DecoratorModel(
      options.nodeDecorators ?? [],
      options.nodeDefaults ?? DecoratorModel.DEFAULT_NODE_DECORATION,
      options.edgeDecorators ?? [],
      options.edgeDefaults ?? DecoratorModel.DEFAULT_EDGE_DECORATION
    )
  }

  constructor(
    private readonly nodeDecorators: NodeDecorator[],
    private readonly nodeDefaults: NodeDecoration,
    private readonly edgeDecorators: EdgeDecorator[],
    private readonly edgeDefaults: EdgeDecoration
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
  getNodeDefaults(): NodeDecoration {
    return this.nodeDefaults
  }

  getEdgeDefaults(): EdgeDecoration {
    return this.edgeDefaults
  }

  getNodeDecorationOverrides(node: ModelNode): Partial<NodeDecoration> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, attributes, ...nodeStyle } = node
    const decor = Object.assign(
      {},
      ...this.nodeDecorators.map((d) => d(node))
    ) as Partial<NodeDecoration>
    return {
      ...decor,
      ...nodeStyle,
    }
  }

  getEdgeDecorationOverrides(edge: ModelEdge): Partial<EdgeDecoration> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, attributes, source, target, ...edgeStyle } = edge
    const decor = Object.assign(
      {},
      ...this.edgeDecorators.map((d) => d(edge))
    ) as Partial<EdgeDecoration>
    return {
      ...decor,
      ...edgeStyle,
    }
  }

  getDecoratedNodes(modelNodes: ModelNode[]): DecoratedNode[] {
    return Object.values(modelNodes).map((node) => {
      return {
        ...this.nodeDefaults,
        ...this.getNodeDecorationOverrides(node),
        ...node,
      }
    })
  }

  getDecoratedEdges(modelEdges: ModelEdge[]): DecoratedEdge[] {
    return Object.values(modelEdges).map((edge) => {
      return {
        ...this.edgeDefaults,
        ...this.getEdgeDecorationOverrides(edge),
        ...edge,
      }
    })
  }
}
