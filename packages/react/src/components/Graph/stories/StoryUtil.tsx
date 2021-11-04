import { Generator, GraphModel } from '@committed/graph'
import React from 'react'
import { Graph } from '../'
import { cytoscapeRenderer, GraphRendererOptions } from '../../../graph'

export const exampleModel = Generator.randomGraph()

export const Template: React.FC<{
  model: GraphModel
  onModelChange: (
    model: GraphModel | ((model2: GraphModel) => GraphModel)
  ) => void
  height?: GraphRendererOptions['height']
}> = ({ model, onModelChange, height }) => {
  return (
    <Graph
      model={model}
      onModelChange={onModelChange}
      renderer={cytoscapeRenderer}
      options={{ height: height ?? 600 }}
    />
  )
}
