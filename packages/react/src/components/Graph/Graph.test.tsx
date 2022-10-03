import React, { useState } from 'react'
import { renderLight, renderDark } from '../../test/setup'
import { ContentModel, GraphModel } from '@committed/graph'
import { exampleGraphData } from '../../test/exampleData'
import { Graph } from './Graph'
import { exampleRenderer } from '../../test/ExampleRenderer'

export const CustomRenderer: React.FC<{ initialModel?: GraphModel }> = ({
  initialModel = GraphModel.createEmpty(),
}) => {
  const [model, setModel] = useState(initialModel)
  return (
    <Graph
      model={model}
      onModelChange={setModel}
      renderer={exampleRenderer}
      options={{ height: 600 }}
    />
  )
}

it('renders light', () => {
  const { asFragment } = renderLight(
    <CustomRenderer
      initialModel={new GraphModel(ContentModel.fromRaw(exampleGraphData))}
    />
  )
  expect(asFragment()).toBeDefined()
})

it('renders dark', () => {
  const { asFragment } = renderDark(
    <CustomRenderer
      initialModel={new GraphModel(ContentModel.fromRaw(exampleGraphData))}
    />
  )
  expect(asFragment()).toBeDefined()
})
