/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CustomGraphLayout, GraphModel } from '@committed/graph'
import {
  Core,
  Ext,
  LayoutEventObject,
  LayoutManipulation,
  LayoutPositionOptions,
} from 'cytoscape'

export type CytoscapeGraphLayoutAdapterOptions = LayoutPositionOptions & {
  name: string
  model: GraphModel
  algorithm: CustomGraphLayout
  // Provided
  cy: Core
}

export type CytoscapeGraphLayoutAdapterManipulation = LayoutManipulation & {
  options: CytoscapeGraphLayoutAdapterOptions
}

export const CUSTOM_LAYOUT_NAME = 'custom'

export function CytoscapeGraphLayoutAdapter(
  this: CytoscapeGraphLayoutAdapterManipulation,
  options: CytoscapeGraphLayoutAdapterOptions
): void {
  this.options = Object.assign({}, options, { name: CUSTOM_LAYOUT_NAME })

  this.run = function (
    this: CytoscapeGraphLayoutAdapterManipulation & LayoutEventObject
  ) {
    if (this.options.algorithm == null) {
      throw new Error('No custom layout algorithm was specified')
    }

    const cy: Core = this.options.cy
    const boundingBox = { x1: 0, y1: 0, w: cy.width(), h: cy.height() }
    const nodePositions = this.options.algorithm.runLayout(this.options.model, {
      boundingBox,
    })
    this.options.eles.nodes().positions((n: { id: () => string | number }) => {
      return nodePositions[n.id()]
    })
    return this
  }
  this.start = function () {
    return this.run()
  }

  // called on continuous layouts to stop them before they finish
  this.stop = function () {
    this.options.algorithm.stopLayout()
    return this
  }
}

export const register: Ext = (cytoscape) => {
  if (cytoscape == null) {
    return
  } // can't register if cytoscape unspecified
  cytoscape(
    'layout',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    CUSTOM_LAYOUT_NAME,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    CytoscapeGraphLayoutAdapter
  )
}
