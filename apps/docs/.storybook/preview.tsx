import { initializeCytoscape } from '@committed/components-graph-react';
import { Preview } from '@storybook/react';
import { use } from 'cytoscape';
import React from 'react';
import '../src/panda.css';
import { withTheme } from './committed/withTheme';
export const withCytoscape = 
  (Story) => {
    initializeCytoscape(use)
     return  (<Story />)
  }


const preview: Preview = {
  parameters: {
    // actions: { argTypesRegex: '^on[A-Z].*' },
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
  },
  decorators: [ withTheme({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
  }) , withCytoscape]
}

export default preview
