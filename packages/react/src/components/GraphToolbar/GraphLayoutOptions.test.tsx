import { cytoscapeRenderer } from '../../graph'
import React from 'react'
import { renderLight, screen, userEvent } from '../../test/setup'
import { Layout } from './GraphToolbar.test'

it('Can select layouts', () => {
  renderLight(
    <Layout
      withGraph={false}
      layouts={[
        ...cytoscapeRenderer.layouts,
        {
          name: 'test',
          runLayout: jest.fn(),
          stopLayout: jest.fn(),
        },
      ]}
    />
  )

  screen.getByRole('button', { name: /Layout/i })

  userEvent.tab()
  userEvent.tab()
  userEvent.keyboard('{enter}')

  screen.getByRole('menuitem', { name: /Graph Layout/i })
  userEvent.keyboard('{enter}')

  expect(
    screen
      .getByRole('menuitemradio', { name: /Force-directed/i })
      .getAttribute('aria-checked')
  ).toBe('true')
  expect(
    screen
      .getByRole('menuitemradio', { name: /Circle/i })
      .getAttribute('aria-checked')
  ).toBe('false')
  expect(
    screen
      .getByRole('menuitemradio', { name: /test/i })
      .getAttribute('aria-checked')
  ).toBe('false')

  userEvent.click(screen.getByRole('menuitemradio', { name: /Cola/i }))

  // Cola should now be selected
  userEvent.tab()
  userEvent.tab()
  userEvent.keyboard('{enter}')
  userEvent.keyboard('{enter}')

  expect(
    screen
      .getByRole('menuitemradio', { name: /Force-directed/i })
      .getAttribute('aria-checked')
  ).toBe('false')
  expect(
    screen
      .getByRole('menuitemradio', { name: /Cola/i })
      .getAttribute('aria-checked')
  ).toBe('true')
  userEvent.click(screen.getByRole('menuitemradio', { name: /test/i }))
})

it('no options when no layout', () => {
  renderLight(<Layout withGraph={false} layouts={[]} />)
  expect(
    screen.queryByRole('button', { name: /Layout/i })
  ).not.toBeInTheDocument()

  expect(
    screen.queryByRole('button', { name: /Settings/i })
  ).not.toBeInTheDocument()
})
