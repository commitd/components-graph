import { GraphModel } from '@committed/graph'
import React from 'react'
import { GraphDebugControl } from '.'
import { renderDark, renderLight, userEvent } from '../../setupTests'

it('renders light', () => {
  const { asFragment } = renderLight(
    <GraphDebugControl
      model={GraphModel.createEmpty()}
      onChange={jest.fn()}
      onReset={jest.fn()}
    />
  )
  expect(asFragment()).toBeDefined()
})

it('renders dark', () => {
  const { asFragment } = renderDark(
    <GraphDebugControl
      model={GraphModel.createEmpty()}
      onChange={jest.fn()}
      onReset={jest.fn()}
    />
  )
  expect(asFragment()).toBeDefined()
})

test.each([
  ['Add Node'],
  ['Add 10 Nodes'],
  ['Add 100 Nodes'],
  ['Add Edge'],
  ['Add 10 Edges'],
  ['Add 100 Edges'],
  ['Remove Random Node'],
  ['Remove Random Edge'],
  ['Layout'],
])('button label %s changes graph', (label) => {
  const onChange = jest.fn()
  const { getByRole } = renderLight(
    <GraphDebugControl
      model={GraphModel.createEmpty()}
      onChange={onChange}
      onReset={jest.fn()}
    />
  )

  userEvent.click(getByRole('button', { name: label }))
  expect(onChange).toHaveBeenCalled()
})

it('reset', () => {
  const onReset = jest.fn()
  const { getByRole } = renderLight(
    <GraphDebugControl
      model={GraphModel.createEmpty()}
      onChange={jest.fn()}
      onReset={onReset}
    />
  )

  userEvent.click(getByRole('button', { name: 'Reset' }))
  expect(onReset).toHaveBeenCalled()
})
