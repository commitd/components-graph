import React from 'react'
import { renderLight, screen, userEvent } from '../../test/setup'
import { Relayout } from './GraphToolbar.test'

it('Can select to size by', () => {
  renderLight(<Relayout withGraph={false} />)
  userEvent.tab()
  userEvent.keyboard('{enter}')
  expect(
    screen
      .getByRole('menuitemcheckbox', { name: /Layout on change/i })
      .getAttribute('aria-checked')
  ).toBe('true')
  userEvent.click(
    screen.getByRole('menuitemcheckbox', { name: /Layout on change/i })
  )
  userEvent.tab()
  userEvent.keyboard('{enter}')
  expect(
    screen
      .getByRole('menuitemcheckbox', { name: /Layout on change/i })
      .getAttribute('aria-checked')
  ).toBe('false')
})
