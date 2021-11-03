import React from 'react'
import { renderLight, screen, userEvent } from '../../test/setup'
import { SizeBy } from './GraphToolbar.stories'

it('Can select to size by', () => {
  renderLight(<SizeBy {...(SizeBy.args as any)} withGraph={false} />)

  userEvent.tab()
  userEvent.keyboard('{enter}')

  userEvent.click(screen.getByRole('menuitem', { name: 'Size nodes by' }))

  expect(
    screen
      .getByRole('menuitemradio', { name: 'None' })
      .getAttribute('aria-checked')
  ).toBe('true')
  userEvent.click(screen.getByRole('menuitemradio', { name: 'Age' }))

  // Age should now be selected
  userEvent.tab()
  userEvent.keyboard('{enter}')
  userEvent.click(screen.getByRole('menuitem', { name: 'Size nodes by' }))

  expect(
    screen
      .getByRole('menuitemradio', { name: 'None' })
      .getAttribute('aria-checked')
  ).toBe('false')
  expect(
    screen
      .getByRole('menuitemradio', { name: 'Age' })
      .getAttribute('aria-checked')
  ).toBe('true')
})
