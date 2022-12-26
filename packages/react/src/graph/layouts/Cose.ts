import { commonOptions } from './CommonOptions'

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

export const cose: CoseBilkentLayoutOptions = {
  ...commonOptions,
  name: 'cose-bilkent',
  // - 'draft' fast cooling rate
  // - 'default' moderate cooling rate
  // - "proof" slow cooling rate
  quality: 'default',
  // Whether to include labels in node dimensions. Useful for avoiding label overlap
  nodeDimensionsIncludeLabels: false,
  // number of ticks per frame; higher is faster but more jerky
  refresh: 30,
  // Whether to enable incremental mode
  randomize: true,
  // Node repulsion (non overlapping) multiplier
  nodeRepulsion: 4500,
  // Ideal (intra-graph) edge length
  idealEdgeLength: 50,
  // Divisor to compute edge forces
  edgeElasticity: 0.45,
  // Nesting factor (multiplier) to compute ideal edge length for inter-graph edges
  nestingFactor: 0.1,
  // Gravity force (constant)
  gravity: 0.25,
  // Maximum number of iterations to perform
  numIter: 2500,
  // Whether to tile disconnected nodes
  tile: true,
  // Amount of vertical space to put between degree zero nodes during tiling (can also be a function)
  tilingPaddingVertical: 10,
  // Amount of horizontal space to put between degree zero nodes during tiling (can also be a function)
  tilingPaddingHorizontal: 10,
  // Gravity range (constant) for compounds
  gravityRangeCompound: 1.5,
  // Gravity force (constant) for compounds
  gravityCompound: 1.0,
  // Gravity range (constant)
  gravityRange: 3.8,
  // Initial cooling factor for incremental layout
  initialEnergyOnIncremental: 0.5,
}
