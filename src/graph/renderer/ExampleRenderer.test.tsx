import React from 'react'
import { Graph } from '../../components'
import {
  exampleGraph,
  renderDark,
  renderLight,
  userEvent,
} from '../../setupTests'
import { GraphModel } from '../GraphModel'
import { exampleRenderer } from './ExampleRenderer'

let graphModel: GraphModel

beforeEach(() => {
  graphModel = exampleGraph
})

it('can be rendered light', () => {
  const onChange = jest.fn()

  const { asFragment } = renderLight(
    <Graph
      model={graphModel}
      onModelChange={onChange}
      renderer={exampleRenderer}
      options={{ height: 'full-height' }}
    />
  )
  expect(asFragment()).toMatchSnapshot()
})

it('can be rendered light', () => {
  const onChange = jest.fn()

  const { asFragment } = renderDark(
    <Graph
      model={graphModel}
      onModelChange={onChange}
      renderer={exampleRenderer}
      options={{ height: 'full-height' }}
    />
  )
  expect(asFragment()).toMatchSnapshot()
})

it('can add node', () => {
  const onChange = jest.fn()

  const { getByText } = renderLight(
    <Graph
      model={graphModel}
      onModelChange={onChange}
      renderer={exampleRenderer}
      options={{ height: 'full-height' }}
    />
  )

  userEvent.click(getByText('Add Node'))
  expect(onChange).toHaveBeenCalled()
})

it('can add Edge', () => {
  const onChange = jest.fn()

  const { getByText } = renderLight(
    <Graph
      model={graphModel}
      onModelChange={onChange}
      renderer={exampleRenderer}
      options={{ height: 'full-height' }}
    />
  )

  userEvent.click(getByText('Add Edge'))
  expect(onChange).toHaveBeenCalled()
})

it('can not add edge if empty', () => {
  const onChange = jest.fn()
  graphModel = GraphModel.createEmpty()

  const { getByText } = renderLight(
    <Graph
      model={graphModel}
      onModelChange={onChange}
      renderer={exampleRenderer}
      options={{ height: 'full-height' }}
    />
  )

  userEvent.click(getByText('Add Edge'))
  expect(onChange).toHaveBeenCalledWith(graphModel)
})
