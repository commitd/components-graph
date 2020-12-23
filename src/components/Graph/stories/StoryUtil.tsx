import React from 'react'
import { Graph } from '../'
import {
  addRandomEdge,
  addRandomNode,
  GraphModel,
  cytoscapeRenderer,
  GraphRendererOptions,
} from '../../../graph'

export const exampleModel = addRandomEdge(
  addRandomNode(GraphModel.createEmpty(), 20),
  15
)

export const Template: React.FC<{
  model: GraphModel
  onModelChange?: (
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
