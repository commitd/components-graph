import { PresetGraphLayout } from '@committed/graph'
import { LayoutOptions } from 'cytoscape'
import { circle } from './Circle'
import { cola } from './Cola'
import { grid } from './Grid'
import { dagre } from './Dagre'
import { breadthfirst } from './Breathfirst'
import { concentric } from './Concentric'
import { cose } from './Cose'
import { forceDirected } from './ForceDirected'

export const layouts: Record<PresetGraphLayout, LayoutOptions> = {
  circle,
  cola,
  grid,
  hierarchical: dagre,
  concentric,
  cose,
  'breadth-first': breadthfirst,
  'force-directed': forceDirected,
}
