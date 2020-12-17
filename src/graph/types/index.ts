import { GraphModel } from '../GraphModel'
import { Css, Position as CyPosition } from 'cytoscape'

export interface ModelItem {
  id: string
  attributes: ModelAttributeSet
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ModelNode extends ModelItem, Partial<NodeDecoration> {}

export interface ModelEdge extends ModelItem, Partial<EdgeDecoration> {
  source: string
  target: string
}

export type ModelAttributeSet = Record<string, ModelAttributeValue>

export type ModelAttributeValue = unknown

export type ModelGraphData = {
  nodes: Record<string, ModelNode>
  edges: Record<string, ModelEdge>
}

export interface GraphRenderer<O extends GraphRendererOptions> {
  render: (
    graphModel: GraphModel,
    onChange: (
      model: GraphModel | ((model2: GraphModel) => GraphModel)
    ) => void,
    options: O
  ) => React.ReactNode
  defaultOptions: O
}

export interface GraphRendererOptions {
  width?: number | 'full-width'
  height: number | 'full-height'
}

export interface ItemDecoration {
  label: string
  size: number
  color: string
  opacity: number
}

export interface NodeDecoration extends ItemDecoration {
  icon?: string
  shape: NodeShape
  strokeColor: string
  strokeSize: number
  // label opts
}

export interface EdgeDecoration extends ItemDecoration {
  sourceArrow: boolean
  targetArrow: boolean
  style: EdgeStyle
}

export type DecoratedNode = ModelNode & NodeDecoration

export type DecoratedEdge = ModelEdge & EdgeDecoration

export type NodeDecorator = (node: ModelNode) => Partial<NodeDecoration>

export type EdgeDecorator = (edge: ModelEdge) => Partial<EdgeDecoration>

export type NodeShape = Css.NodeShape

export type EdgeStyle = Css.LineStyle

export type PresetGraphLayout = 'force-directed' | 'circle' | 'grid' | 'cola'
export type CustomGraphLayout = 'custom'

export type GraphLayout = PresetGraphLayout | CustomGraphLayout

export type NodePosition = CyPosition

export interface GraphLayoutAlgorithm {
  runLayout(
    model: GraphModel,
    options: GraphLayoutOptions
  ): Record<string, NodePosition>

  // called on continuous layouts to stop them before they finish
  stopLayout(): void
}

export interface GraphLayoutOptions {
  boundingBox: BoundingBox
}

export interface BoundingBox {
  x1: number
  y1: number
  w: number
  h: number
}
