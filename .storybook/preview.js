import { committedLight } from './committed/theme.js'

export const parameters = {
  actions: { argTypesRegex: '^on.*' },
  options: {
    storySort: {
      order: ['Introduction', 'Components'],
    },
  },
  docs: {
    theme: committedLight,
  },
}
