import { ThemeProvider } from '@committed/components'
import { StylesProvider } from '@material-ui/styles'
import '@testing-library/jest-dom/extend-expect'
import { render, RenderOptions, RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GenerateId } from 'jss'
import React from 'react'

const generateClassName: GenerateId = (rule, styleSheet) => {
  const prefix =
    styleSheet === undefined || styleSheet.options.classNamePrefix === undefined
      ? ''
      : styleSheet.options.classNamePrefix
  return `${prefix}-${rule.key}`
}

const LightTheme: React.FC = ({ children }) => (
  <StylesProvider generateClassName={generateClassName}>
    <ThemeProvider choice="light">{children}</ThemeProvider>
  </StylesProvider>
)

const DarkTheme: React.FC = ({ children }) => (
  <StylesProvider generateClassName={generateClassName}>
    <ThemeProvider choice="dark">{children}</ThemeProvider>
  </StylesProvider>
)

export const renderPlain = render

export const renderLight = (
  ui: Readonly<React.ReactElement>,
  options?: Omit<RenderOptions, 'queries'>
): RenderResult => render(ui, { wrapper: LightTheme, ...options })

export const renderDark = (
  ui: Readonly<React.ReactElement>,
  options?: Omit<RenderOptions, 'queries'>
): RenderResult => render(ui, { wrapper: DarkTheme, ...options })

// re-export everything
export * from '@testing-library/react'
export { userEvent }
