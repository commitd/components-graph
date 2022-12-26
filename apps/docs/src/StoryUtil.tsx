import { CyGraphRendererOptions, cytoscapeRenderer, Graph } from '@committed/components-graph'
import { Generator, GraphModel } from '@committed/graph'
import React from 'react'

export const exampleModel = Generator.randomGraph()

export const Template: React.FC<{
  model: GraphModel
  onModelChange: (
    model: GraphModel | ((model2: GraphModel) => GraphModel)
  ) => void
  options?: CyGraphRendererOptions
}> = ({ model, onModelChange, options, children }) => {
  return (<>
      {children}
      <Graph
        model={model}
        onModelChange={onModelChange}
        renderer={cytoscapeRenderer}
        options={{ height: 600, ...options }}
      />
    </>
  )
}
