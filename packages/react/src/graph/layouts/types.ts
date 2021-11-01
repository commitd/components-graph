import { CustomGraphLayout } from '@committed/graph'

export type PresetGraphLayout = 'force-directed' | 'circle' | 'grid' | 'cola'
export type GraphLayout = PresetGraphLayout | CustomGraphLayout
