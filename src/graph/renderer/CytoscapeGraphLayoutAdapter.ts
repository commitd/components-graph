import { Ext, LayoutManipulation, LayoutPositionOptions, Core } from 'cytoscape'
import { GraphModel } from '../GraphModel'
import { CustomGraphLayout } from '../types'

export type CustomLayoutOptions = {
  model: GraphModel
  algorithm: CustomGraphLayout
}

export class CytoscapeGraphLayoutAdapter implements LayoutManipulation {
  private readonly options: LayoutPositionOptions & CustomLayoutOptions

  static readonly LAYOUT_NAME: string = 'custom'

  constructor(options: LayoutPositionOptions & CustomLayoutOptions) {
    this.options = options
  }

  static register: Ext = (cytoscape) => {
    if (cytoscape == null) {
      return
    } // can't register if cytoscape unspecified
    cytoscape(
      'layout',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      CytoscapeGraphLayoutAdapter.LAYOUT_NAME,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      CytoscapeGraphLayoutAdapter
    )
  }

  run(): this {
    if (this.options.algorithm == null) {
      throw new Error('No custom layout algorithm was specified')
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
