import { DecoratedNode, GraphModel } from '@committed/graph'
import { FC } from 'react'
import { PresetGraphLayout } from '../layouts'

export interface GraphRenderer<O extends GraphRendererOptions> {
  render: FC<{
    graphModel: GraphModel
    onChange: (model: GraphModel | ((model2: GraphModel) => GraphModel)) => void
    onViewNode?: (node: DecoratedNode) => void
    options: O
  }>
  defaultOptions: O
  layouts: PresetGraphLayout[]
}

export interface GraphRendererOptions {
  width?: number | 'full-width'
  height: number | 'full-height'
}
