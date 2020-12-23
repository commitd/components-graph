import React from 'react'
import { GraphDebugControl } from '.'
import { GraphModel } from '../../graph/GraphModel'
import { renderDark, renderLight, userEvent } from '../../setupTests'

it('renders light', () => {
  const { asFragment } = renderLight(
    <GraphDebugControl
      model={GraphModel.createEmpty()}
      onChange={jest.fn()}
      onReset={jest.fn()}
    />
  )
  expect(asFragment()).toMatchSnapshot()
})

it('renders dark', () => {
  const { asFragment } = renderDark(
    <GraphDebugControl
      model={GraphModel.createEmpty()}
      onChange={jest.fn()}
      onReset={jest.fn()}
    />
  )
  expect(asFragment()).toMatchSnapshot()
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

it('layout', () => {
  const onChange = jest.fn()
  const { getByRole } = renderLight(
    <GraphDebugControl
      model={GraphModel.createEmpty()}
      onReset={jest.fn()}
      onChange={onChange}
    />
  )

  userEvent.click(getByRole('button', { name: 'force-directed' }))
  userEvent.click(getByRole('option', { name: 'circle' }))
  expect(onChange).toHaveBeenCalled()
})
