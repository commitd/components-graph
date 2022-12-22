import { DecoratedNode, GraphModel, PresetGraphLayout } from '@committed/graph'
import { FC } from 'react'

export interface GraphRenderer<O extends GraphRendererOptions> {
  render: FC<{
    graphModel: GraphModel
    onChange: (model: GraphModel | ((model2: GraphModel) => GraphModel)) => void
    onViewNode?: (node: DecoratedNode) => void
    options: O
  }>
  defaultOptions: O
  layouts: PresetGraphLayout[]
}

export interface GraphRendererOptions {
  width?: number | 'full-width'
  height: number | 'full-height'
}

export interface CoseBilkentLayoutOptions
  extends cytoscape.ShapedLayoutOptions {
  name: 'cose-bilkent'

  // - 'draft' fast cooling rate
  // - 'default' moderate cooling rate
  // - "proof" slow cooling rate
  quality: 'draft' | 'default' | 'proof'
  // Whether to include labels in node dimensions. Useful for avoiding label overlap
  nodeDimensionsIncludeLabels: boolean
  // number of ticks per frame; higher is faster but more jerky
  refresh: number
  // Whether to enable incremental mode
  randomize: boolean
  // Node repulsion (non overlapping) multiplier
  nodeRepulsion: number
  // Ideal (intra-graph) edge length
  idealEdgeLength: number
  // Divisor to compute edge forces
  edgeElasticity: number
  // Nesting factor (multiplier) to compute ideal edge length for inter-graph edges
  nestingFactor: number
  // Gravity force (constant)
  gravity: number
  // Maximum number of iterations to perform
  numIter: number
  // Whether to tile disconnected nodes
  tile: true
  // Amount of vertical space to put between degree zero nodes during tiling (can also be a function)
  tilingPaddingVertical: number
  // Amount of horizontal space to put between degree zero nodes during tiling (can also be a function)
  tilingPaddingHorizontal: number
  // Gravity range (constant) for compounds
  gravityRangeCompound: number
  // Gravity force (constant) for compounds
  gravityCompound: number
  // Gravity range (constant)
  gravityRange: number
  // Initial cooling factor for incremental layout
  initialEnergyOnIncremental: number
}
