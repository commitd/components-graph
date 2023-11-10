import { initializeCytoscape } from '@committed/components-graph';
import { Preview } from '@storybook/react';
import { use } from 'cytoscape';
import React from 'react';
import '../src/panda.css';
import { committedDark, committedLight } from './committed/theme';
import { withTheme } from './committed/withTheme';
import { DocsContainer } from './components/DocsContainer';

export const withCytoscape = 
  (Story) => {
    initializeCytoscape(use)
     return  (<Story />)
  }


const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
    matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
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
    darkMode: {
      stylePreview: true,
      dark: committedDark,
      darkClass: 'dark',
      light: committedLight,
      lightClass: 'light',
    },
  },
  decorators: [withTheme, withCytoscape]
}

export default preview
