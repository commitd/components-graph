import React from 'react';
import { withTheme } from './committed/withTheme'
import { DocsContainer } from './components/DocsContainer'
import { use } from 'cytoscape';
import { initializeCytoscape } from '@committed/components-graph'

export const withCytoscape = 
  (Story) => {
    initializeCytoscape(use)
     return  <Story />
  }

export const decorators = [withTheme, withCytoscape]
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
