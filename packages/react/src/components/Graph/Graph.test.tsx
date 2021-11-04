import React from 'react'
import { renderLight, renderDark } from '../../test/setup'
import { CustomRenderer } from './stories/CustomRenderer.stories'
import { ContentModel, GraphModel } from '@committed/graph'
import { exampleGraphData } from './stories/exampleData'

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
