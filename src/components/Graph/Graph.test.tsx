import React from 'react'
import { render } from '../../setupTests'
import { CustomRenderer } from './Graph.stories'

it('renders story', () => {
  render(<CustomRenderer />)
})
