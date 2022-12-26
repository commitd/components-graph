import { BreadthFirstLayoutOptions } from 'cytoscape'
import { commonOptions } from './CommonOptions'

export type { BreadthFirstLayoutOptions }

export const breadthfirst: BreadthFirstLayoutOptions = {
  ...commonOptions,
  name: 'breadthfirst',

  directed: false, // whether the tree is directed downwards (or edges can point in any direction if false)
  circle: false, // put depths in concentric circles if true, put depths top down if false
  grid: false, // whether to create an even grid into which the DAG is placed (circle:false only)
  spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
  nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
  roots: undefined, // the roots of the trees
  maximal: false, // whether to shift nodes down their natural BFS depths in order to avoid upwards edges (DAGS only)
  depthSort: undefined, // a sorting function to order nodes at equal depth. e.g. function(a, b){ return a.data('weight') - b.data('weight') }
}
