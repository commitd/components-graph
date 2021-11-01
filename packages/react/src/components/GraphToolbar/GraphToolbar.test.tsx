import { GraphModel } from '@committed/graph'
import React from 'react'
import { GraphToolbar } from '.'
import { cytoscapeRenderer } from '../../graph'
import { renderDark, renderLight, userEvent } from '../../setupTests'
import { Empty, Horizontal, Vertical } from './GraphToolbar.stories'

it('renders light', () => {
  const { asFragment } = renderLight(
    <Horizontal {...(Horizontal.args as any)} withGraph={false} />
  )
  expect(asFragment()).toBeDefined()
})

it('renders dark', () => {
  const { asFragment } = renderDark(
    <Vertical {...(Vertical.args as any)} withGraph={false} />
  )
  expect(asFragment()).toBeDefined()
})

test.each([
  [/zoom-in/i, 'ZoomIn'],
  [/zoom-out/i, 'ZoomOut'],
  [/layout/i, 'Layout'],
  [/refit/i, 'Refit'],
])('button label %s issues command %s', (pattern, command) => {
  const onChange = jest.fn()
  const { getByRole } = renderLight(
    <GraphToolbar
      direction="row"
      model={GraphModel.createEmpty()}
      onModelChange={onChange}
      layouts={cytoscapeRenderer.layouts}
    />
  )

  userEvent.click(getByRole('button', { name: pattern }))
  const newModel = onChange.mock.calls[0][0] as GraphModel
  expect(newModel.getCommands()[0]).toEqual({ type: command })
})

it('renders empty', () => {
  const { asFragment } = renderDark(
    <Empty {...(Empty.args as any)} withGraph={false} />
  )
  expect(asFragment()).toBeDefined()
})
