import { Ext, LayoutManipulation, LayoutPositionOptions, Core } from 'cytoscape'
import { GraphModel } from '../GraphModel'
import { GraphLayout, GraphLayoutAlgorithm } from '../types'

export type CustomLayoutOptions = {
  model: GraphModel
  algorithm: GraphLayoutAlgorithm
}

export class CytoscapeGraphLayoutAdapter implements LayoutManipulation {
  private readonly options: LayoutPositionOptions & CustomLayoutOptions

  static readonly LAYOUT_NAME: GraphLayout = 'custom'

  constructor(options: LayoutPositionOptions & CustomLayoutOptions) {
    this.options = options
  }

  static register: Ext = (cytoscape) => {
    if (cytoscape == null) {
      return
    } // can't register if cytoscape unspecified
    cytoscape(
      'layout',
      // @ts-ignore
      CytoscapeGraphLayoutAdapter.LAYOUT_NAME,
      // @ts-ignore
      CytoscapeGraphLayoutAdapter
    )
  }

  run(): this {
    if (this.options.algorithm == null) {
      throw new Error('No custom layout algorithm was specified')
    }

    //@ts-ignore
    const cy: Core = this.options.cy
    const boundingBox = { x1: 0, y1: 0, w: cy.width(), h: cy.height() }
    const nodePositions = this.options.algorithm.runLayout(this.options.model, {
      boundingBox,
    })
    this.options.eles.nodes().positions((n) => {
      return nodePositions[n.id()]
    })
    return this
  }

  // alias for run()
  start(): this {
    return this.run()
  }

  // called on continuous layouts to stop them before they finish
  stop(): this {
    this.options.algorithm.stopLayout()
    return this
  }
}
