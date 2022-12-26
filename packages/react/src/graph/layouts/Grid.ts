import { GridLayoutOptions } from 'cytoscape'
import { commonOptions } from './CommonOptions'

export type { GridLayoutOptions }
export const grid: GridLayoutOptions = {
  ...(commonOptions as GridLayoutOptions),
  name: 'grid',

  avoidOverlapPadding: 10, // extra spacing around nodes when avoidOverlap: true
  nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
  spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  condense: false, // uses all available space on false, uses minimal space on true
  rows: undefined, // force num of rows in the grid
  cols: undefined, // force num of columns in the grid
  sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
}
