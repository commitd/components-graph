import React from 'react'
import { render } from '../../setupTests'
import { Horizontal } from './GraphToolbar.stories'

it('renders story', () => {
  const { asFragment } = render(<Horizontal />)
  expect(asFragment()).toMatchSnapshot()
})
