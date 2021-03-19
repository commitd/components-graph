import { ThemeProvider } from '@committed/components'
import React from 'react'
import { useDarkMode } from 'storybook-dark-mode'

/**
 * Wrap a component with the default ThemeProvider
 *
 * @param {*} Story storybook component to wrap
 */
export const withTheme = (Story) => {
  const choice = useDarkMode() ? 'dark' : 'light'
  return (
    <ThemeProvider choice={choice}>
      <Story />
    </ThemeProvider>
  )
}
