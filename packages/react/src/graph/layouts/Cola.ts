import { commonOptions } from './CommonOptions'

export interface ColaLayoutOptions extends cytoscape.ShapedLayoutOptions {
  name: 'cola'
  refresh: undefined | number // number of ticks per frame; higher is faster but more jerky
  maxSimulationTime: undefined | number // max length in ms to run the layout
  ungrabifyWhileSimulating: undefined | boolean // so you can't drag nodes during layout
  handleDisconnected: undefined | boolean // if true, avoids disconnected components from overlapping
  convergenceThreshold: undefined | number // when the alpha value (system energy) falls below this value, the layout stops

  flow: any // use DAG/tree flow layout if specified, e.g. { axis: 'y', minSeparation: 30 }
  alignment: any // relative alignment constraints on nodes, e.g. {vertical: [[{node: node1, offset: 0}, {node: node2, offset: 5}]], horizontal: [[{node: node3}, {node: node4}], [{node: node5}, {node: node6}]]}
  gapInequalities: any // list of inequality constraints for the gap between the nodes, e.g. [{"axis":"y", "left":node1, "right":node2, "gap":25}]

  // different methods of specifying edge length
  // each can be a constant numerical value or a function like `function( edge ){ return 2; }`
  edgeLength: undefined | number // sets edge length directly in simulation
  edgeSymDiffLength: undefined | number // symmetric diff edge length in simulation
  edgeJaccardLength: undefined | number // jaccard edge length in simulation

  // iterations of cola algorithm; uses default values on undefined | number
  unconstrIter: undefined | number // unconstrained initial layout iterations
  userConstIter: undefined | number // initial layout iterations with user-specified constraints
  allConstIter: undefined | number // initial layout iterations with all constraints including non-overlap
}

export const cola: ColaLayoutOptions = {
  ...commonOptions,
  name: 'cola',
  refresh: 1, // number of ticks per frame; higher is faster but more jerky
  maxSimulationTime: 4000, // max length in ms to run the layout
  ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
  handleDisconnected: true, // if true, avoids disconnected components from overlapping
  convergenceThreshold: 0.01, // when the alpha value (system energy) falls below this value, the layout stops
  flow: undefined, // use DAG/tree flow layout if specified, e.g. { axis: 'y', minSeparation: 30 }
  alignment: undefined, // relative alignment constraints on nodes, e.g. {vertical: [[{node: node1, offset: 0}, {node: node2, offset: 5}]], horizontal: [[{node: node3}, {node: node4}], [{node: node5}, {node: node6}]]}
  gapInequalities: undefined, // list of inequality constraints for the gap between the nodes, e.g. [{"axis":"y", "left":node1, "right":node2, "gap":25}]

  // different methods of specifying edge length
  // each can be a constant numerical value or a function like `function( edge ){ return 2; }`
  edgeLength: undefined, // sets edge length directly in simulation
  edgeSymDiffLength: undefined, // symmetric diff edge length in simulation
  edgeJaccardLength: undefined, // jaccard edge length in simulation

  // iterations of cola algorithm; uses default values on undefined
  unconstrIter: undefined, // unconstrained initial layout iterations
  userConstIter: undefined, // initial layout iterations with user-specified constraints
  allConstIter: undefined, // initial layout iterations with all constraints including non-overlap
}
