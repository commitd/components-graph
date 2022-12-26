import { PresetGraphLayout } from '@committed/graph'
import { LayoutOptions as CytocapeLayoutOptions } from 'cytoscape'
import { circle, CircleLayoutOptions } from './Circle'
import { cola, ColaLayoutOptions } from './Cola'
import { grid, GridLayoutOptions } from './Grid'
import { dagre, HierarchicalLayoutOptions } from './Dagre'
import { breadthfirst, BreadthFirstLayoutOptions } from './Breathfirst'
import { concentric, ConcentricLayoutOptions } from './Concentric'
import { cose, CoseBilkentLayoutOptions } from './Cose'
import { forceDirected, ForceDirectedLayoutOptions } from './ForceDirected'
export * from './CommonOptions'

export type {
  CircleLayoutOptions,
  ColaLayoutOptions,
  GridLayoutOptions,
  HierarchicalLayoutOptions,
  BreadthFirstLayoutOptions,
  ConcentricLayoutOptions,
  CoseBilkentLayoutOptions,
  ForceDirectedLayoutOptions,
}

export type LayoutOptions =
  | CytocapeLayoutOptions
  | ForceDirectedLayoutOptions
  | ColaLayoutOptions
  | HierarchicalLayoutOptions
  | CoseBilkentLayoutOptions

export const defaultLayouts: Record<PresetGraphLayout, LayoutOptions> = {
  circle,
  cola,
  grid,
  hierarchical: dagre,
  concentric,
  cose,
  'breadth-first': breadthfirst,
  'force-directed': forceDirected,
}
