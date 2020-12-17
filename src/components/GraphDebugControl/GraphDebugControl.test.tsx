import React from 'react'
import { GraphModel } from '../../graph/GraphModel'
import { render } from '../../setupTests'
import { GraphDebugControl } from './GraphDebugControl'

it('renders story', () => {
  render(
    <GraphDebugControl
      model={GraphModel.createEmpty()}
      onChange={() => {}}
      onReset={() => {}}
    />
  )
})
