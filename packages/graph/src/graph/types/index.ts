import { GraphModel } from '../GraphModel'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ModelNode extends Partial<NodeDecoration> {
  id?: string
  metadata?: Metadata
}
export interface ModelEdge extends Partial<EdgeDecoration> {
  source: string
  target: string
  id?: string
  metadata?: Metadata
  directed?: boolean
}

export interface Item {
  id: string
  metadata: Metadata
}

export interface Node extends Item, Partial<NodeDecoration> {}

export interface Edge extends Item, Partial<EdgeDecoration> {
  source: string
  target: string
  directed: boolean
}

export type Metadata = Record<string, MetadataValue>

export type MetadataValue = unknown

export type MetadataTypes = Record<string, Set<string>>

export type ModelGraphData = {
  nodes: Record<string, Partial<ModelNode>>
  edges: ModelEdge[]
}

export type GraphData = {
  nodes: Record<string, Node>
  edges: Record<string, Edge>
}

export interface ItemDecoration {
  label?: string
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
  curve: CurveStyle
}

export interface DecorationFunction<T extends ItemDecoration, S = Partial<T>> {
  (): S
}

export type NodeDecorationFunction = DecorationFunction<NodeDecoration>
export type EdgeDecorationFunction = DecorationFunction<EdgeDecoration>

export interface NodeDecorationCreator {
  getDecorationOverrides: NodeDecorationFunction
}

export interface EdgeDecorationCreator {
  getDecorationOverrides: EdgeDecorationFunction
}

export type DecoratedNode = Node & NodeDecorationCreator

export type DecoratedEdge = Edge & EdgeDecorationCreator

export type NodeDecorator = {
  (node: Node): Partial<NodeDecoration>
  id?: string
}

export type EdgeDecorator = {
  (edge: Edge): Partial<EdgeDecoration>
  id?: string
}

export const NodeShapes = {
  rectangle: 'Rectangle',
  ellipse: 'Ellipse',
  triangle: 'Triangle',
  pentagon: 'Pentagon',
  hexagon: 'Hexagon',
  heptagon: 'Heptagon',
  octagon: 'Octagon',
  star: 'Star',
  barrel: 'Barrel',
  diamond: 'Diamond',
  vee: 'Vee',
  rhomboid: 'Rhomboid',
  tag: 'Tag',
  'round-rectangle': 'Rounded rectangle',
  'round-triangle': 'Rounded triangle',
  'round-diamond': 'Rounded diamond',
  'round-pentagon': 'Rounded pentagon',
  'round-hexagon': 'Rounded hexagon',
  'round-heptagon': 'Rounded heptagon',
  'round-octagon': 'Rounded octagon',
  'round-tag': 'Rounded tag',
  'cut-rectangle': 'Cut rectangle',
  'bottom-round-rectangle': 'Bottom rounded rectangle',
  'concave-hexagon': 'Concave hexagon',
  // Omit polygon as requires further specification
  // polygon: 'Polygon',
} as const

export type NodeShape = keyof typeof NodeShapes

export const EdgeStyles = {
  solid: 'Solid',
  dotted: 'Dotted',
  dashed: 'Dashed',
} as const

export type EdgeStyle = keyof typeof EdgeStyles

export const CurveStyles = {
  haystack: 'Haystack',
  straight: 'Straight',
  'straight-triangle': 'Triangle',
  bezier: 'Bezier',
  'unbundled-bezier': 'Unbundled-bezier',
  segments: 'Segments',
  taxi: 'Taxi',
} as const

export type CurveStyle = keyof typeof CurveStyles

export interface CustomGraphLayout {
  name: string
  runLayout(
    model: GraphModel,
    options: GraphLayoutOptions
  ): Record<string, NodePosition>
  // called on continuous layouts to stop them before they finish
  stopLayout(): void
}

export const PresetGraphLayouts = {
  'force-directed': 'Force-directed',
  circle: 'Circle',
  grid: 'Grid',
  cola: 'Cola',
  hierarchical: 'Hierarchical',
  concentric: 'Concentric',
  'breadth-first': 'Breadth-first',
  cose: 'Cose',
} as const

export type PresetGraphLayout = keyof typeof PresetGraphLayouts

// eslint-disable-next-line @typescript-eslint/ban-types
export type GraphLayout = PresetGraphLayout | (string & {}) | CustomGraphLayout

export function isCustomGraphLayout(
  layout: GraphLayout | string
): layout is CustomGraphLayout {
  return typeof layout !== 'string'
}

export type NodePosition = {
  x: number
  y: number
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

export type GraphCommand =
  | ZoomInCommand
  | ZoomOutCommand
  | RefitCommand
  | LayoutCommand

export interface ZoomInCommand {
  type: 'ZoomIn'
}

export interface ZoomOutCommand {
  type: 'ZoomOut'
}

export interface RefitCommand {
  type: 'Refit'
}

export interface LayoutCommand {
  type: 'Layout'
}
