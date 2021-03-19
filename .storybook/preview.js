import { withTheme } from './committed/withTheme'
import { DocsContainer } from './components/DocContainer.jsx'

export const decorators = [withTheme]
export const parameters = {
  actions: { argTypesRegex: '^on.*' },
  options: {
    storySort: {
      order: [
        'Introduction',
        'Components',
        ['Graph', 'GraphToolbar'],
        'Example',
      ],
    },
  },
  docs: {
    container: DocsContainer,
  },
}
