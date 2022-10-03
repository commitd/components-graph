import { create } from '@storybook/theming'

const overrides = {
  colorPrimary: '#ffbb00',
  colorSecondary: '#4098D7',

  // Typography
  fontBase:
    '-apple-system, BlinkMacSystemFont, "San Francisco", Roboto,  "Segoe UI", "Helvetica Neue"',
  fontCode:
    '"SFMono-Regular", Consolas, "Liberation Mono", "Andale Mono", "Ubuntu Mono", Menlo, Courier, monospace',

  brandTitle: 'Committed Layout',
  brandUrl: '/',
}

export const committedLight = create({
  ...overrides,
  base: 'light',
  brandImage: 'https://committed.io/Committed_Light.svg',
})

export const committedDark = create({
  ...overrides,
  base: 'dark',
  brandImage: 'https://committed.io/Committed_Dark.svg',
})
