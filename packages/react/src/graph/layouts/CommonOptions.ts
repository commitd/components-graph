import { LayoutOptions } from 'cytoscape'

// its possible some options will only apply to certain layouts

export const commonOptions: LayoutOptions = {
  // Whether to animate while running the layout
  // true : Animate continuously as the layout is running
  // false : Just show the end result
  // 'end' : Animate with the end result, from the initial positions to the end positions
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  animate: 'end',

  // Easing of the animation for animate:'end'
  animationEasing: 'ease-in-out',

  // The duration of the animation for animate:'end'
  animationDuration: 500,

  // a function that determines whether the node should be animated.
  // All nodes animated by default on animate enabled.
  // Non-animated nodes are positioned immediately when the layout starts
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  animateFilter: function (_node, _i) {
    return true
  },

  // Whether to fit the network view after when done
  fit: true,

  // Padding on fit
  padding: 30,

  // Excludes the label when calculating node bounding boxes for the layout algorithm
  nodeDimensionsIncludeLabels: true,

  // The layout animates only after this many milliseconds for animate:true
  // (prevents flashing on fast runs)
  animationThreshold: 250,

  // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  boundingBox: undefined,

  avoidOverlap: true, // prevents node overlap, may overflow boundingBox and radius if not enough space

  // Randomize the initial positions of the nodes (true) or use existing positions (false)
  randomize: false,

  // callback on layoutready
  ready: undefined,
  // callback on layoutstop
  stop: undefined,
  // transform a given node position. Useful for changing flow direction in discrete layouts
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform: function (_node, position) {
    return position
  },
}
