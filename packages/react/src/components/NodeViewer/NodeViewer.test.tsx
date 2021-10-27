import React from 'react'
import { renderDark, renderLight } from '../../setupTests'
import { WithAttributes, NoAttributes, NoNode } from './NodeViewer.stories'

it('renders light with attributes', () => {
  const { asFragment } = renderLight(
    <WithAttributes {...(WithAttributes.args as any)} />
  )
  expect(asFragment()).toBeDefined()
})

it('renders dark with no attributes', () => {
  const { asFragment } = renderDark(
    <NoAttributes open={true} {...(NoAttributes.args as any)} />
  )
  expect(asFragment()).toBeDefined()
})
it('renders with no node', () => {
  const { asFragment } = renderDark(
    <NoNode open={true} {...(NoNode.args as any)} />
  )
  expect(asFragment()).toBeDefined()
})
