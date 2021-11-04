import { PresetGraphLayout } from '@committed/graph'
import { LayoutOptions } from 'cytoscape'
import { circle } from './Circle'
import { cola } from './Cola'
import { grid } from './Grid'
import { forceDirected } from './ForceDirected'

export const layouts: Record<PresetGraphLayout, LayoutOptions> = {
  circle,
  cola,
  grid,
  'force-directed': forceDirected,
}
