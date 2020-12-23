import React from 'react'
import { render } from '../../setupTests'
import { CustomRenderer } from './Graph.stories'

// TODO Add canvas to jest:
// Error: Not implemented: HTMLCanvasElement.prototype.getContext (without installing the canvas npm package)
it('renders story', () => {
  render(<CustomRenderer />)
})
