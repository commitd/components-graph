import { CoseLayoutOptions } from 'cytoscape'
import { commonOptions } from './CommonOptions'

export const forceDirected: CoseLayoutOptions = {
  ...(commonOptions as CoseLayoutOptions),
  // https://dl.acm.org/doi/10.1016/j.ins.2008.11.017
  name: 'cose',

  // Number of iterations between consecutive screen positions update
  refresh: 20,

  // Extra spacing between components in non-compound graphs
  componentSpacing: 40,

  // Node repulsion (non overlapping) multiplier
  nodeRepulsion: function () {
    return 2048
  },

  // Node repulsion (overlapping) multiplier
  nodeOverlap: 4,

  // Ideal edge (non nested) length
  idealEdgeLength: function () {
    return 32
  },

  // Divisor to compute edge forces
  edgeElasticity: function () {
    return 32
  },

  // Nesting factor (multiplier) to compute ideal edge length for nested edges
  nestingFactor: 1.2,

  // Gravity force (constant)
  gravity: 1,

  // Maximum number of iterations to perform
  numIter: 1000,

  // Initial temperature (maximum node displacement)
  initialTemp: 1000,

  // Cooling factor (how the temperature is reduced between consecutive iterations
  coolingFactor: 0.99,

  // Lower temperature threshold (below this point the layout will end)
  minTemp: 1.0,
}
