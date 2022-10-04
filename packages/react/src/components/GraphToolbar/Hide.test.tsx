import React from 'react'
import { renderLight, screen, userEvent } from '../../test/setup'
import { Hide } from './GraphToolbar.test'

it('Can select to size by', () => {
  renderLight(<Hide withGraph={false} />)
  userEvent.tab()
  userEvent.keyboard('{enter}')
  expect(
    screen
      .getByRole('menuitemcheckbox', { name: /Hide node labels/i })
      .getAttribute('aria-checked')
  ).toBe('false')
  expect(
    screen
      .getByRole('menuitemcheckbox', { name: /Hide edge labels/i })
      .getAttribute('aria-checked')
  ).toBe('false')
  userEvent.click(
    screen.getByRole('menuitemcheckbox', { name: /Hide node labels/i })
  )
  userEvent.tab()
  userEvent.keyboard('{enter}')
  userEvent.click(
    screen.getByRole('menuitemcheckbox', { name: /Hide edge labels/i })
  )
  userEvent.tab()
  userEvent.keyboard('{enter}')
  expect(
    screen
      .getByRole('menuitemcheckbox', { name: /Hide node labels/i })
      .getAttribute('aria-checked')
  ).toBe('true')
  expect(
    screen
      .getByRole('menuitemcheckbox', { name: /Hide edge labels/i })
      .getAttribute('aria-checked')
  ).toBe('true')
})
