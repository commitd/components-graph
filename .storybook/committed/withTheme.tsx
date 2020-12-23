import React from 'react'
import { ThemeProvider, Box } from '@committed/components'

/**
 * Wrap a component with the default ThemeProvider
 *
 * @param {*} Story storybook component to wrap
 */
export const withTheme = (Story) => {
  return (
    <ThemeProvider choice="dark">
      {/* Temporary background until themeing in docs is supported */}
      <Box bgcolor="background.paper" p={3}>
        <Story />
      </Box>
    </ThemeProvider>
  )
}
