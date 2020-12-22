import { committedLight } from './committed/theme.js'
import { withTheme } from './committed/withTheme'

export const decorators = [withTheme]
export const parameters = {
  actions: { argTypesRegex: '^on.*' },
  options: {
    storySort: {
      order: ['Introduction', 'Components', ['Graph', 'GraphToolbar']],
    },
  },
  docs: {
    theme: committedLight,
  },
}
