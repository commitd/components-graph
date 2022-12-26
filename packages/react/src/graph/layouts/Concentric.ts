import { ConcentricLayoutOptions } from 'cytoscape'
import { commonOptions } from './CommonOptions'

export type { ConcentricLayoutOptions }

export const concentric: ConcentricLayoutOptions = {
  ...commonOptions,
  name: 'concentric',

  startAngle: (3 / 2) * Math.PI, // where nodes start in radians
  sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
  clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
  equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
  minNodeSpacing: 50, // min spacing between outside of nodes (used for radius adjustment)
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
  nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
  height: undefined, // height of layout area (overrides container height)
  width: undefined, // width of layout area (overrides container width)
  spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  concentric: function (node) {
    // returns numeric value for each node, placing higher nodes in levels towards the centre
    return node.degree()
  },
  levelWidth: function (nodes) {
    // the variation of concentric values in each level
    return nodes.maxDegree() / 4
  },
}
