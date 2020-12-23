import React from 'react'
import { renderLight, renderDark } from '../../setupTests'
import { CustomRenderer } from './stories/CustomRenderer.stories'
import { ContentModel, GraphModel } from '../../graph'
import { exampleGraphData } from './stories/exampleData'

it('renders light', () => {
  const { asFragment } = renderLight(
    <CustomRenderer
      initialModel={new GraphModel(ContentModel.fromRaw(exampleGraphData))}
    />
  )
  expect(asFragment()).toMatchSnapshot()
})
it('renders dark', () => {
  const { asFragment } = renderDark(
    <CustomRenderer
      initialModel={new GraphModel(ContentModel.fromRaw(exampleGraphData))}
    />
  )
  expect(asFragment()).toMatchSnapshot()
})
