import React from 'react'
import { renderLight, screen, userEvent } from '../../setupTests'
import { Hide } from './GraphToolbar.stories'

it('Can select to size by', () => {
  renderLight(<Hide {...(Hide.args as any)} withGraph={false} />)

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
