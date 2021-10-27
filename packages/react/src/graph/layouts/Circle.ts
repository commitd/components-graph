import { CircleLayoutOptions } from 'cytoscape'
import { commonOptions } from './CommonOptions'

export const circle: CircleLayoutOptions = {
  ...(commonOptions as CircleLayoutOptions),
  name: 'circle',
  spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  radius: undefined, // the radius of the circle
  startAngle: (3 / 2) * Math.PI, // where nodes start in radians
  sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
  clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
  sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
  // Whether to animate while running the layout
  // true : Animate continuously as the layout is running
  // false : Just show the end result
  // 'end' : Animate with the end result, from the initial positions to the end positions
  ready: undefined, // callback on layoutready
  stop: undefined, // callback on layoutstop
  //   transform: function (node, position) {
  //     return position
  //   }, // transform a given node position. Useful for changing flow direction in discrete layouts
}
