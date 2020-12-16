import React from 'react'
import { Meta } from '@storybook/react'
import { GraphDebugControl } from '.'
import { GraphModel } from '../../graph/GraphModel'
import { ContentModel } from '../../graph/ContentModel'
import { exampleGraphData } from '../Graph/exampleData'
import { ThemeProvider } from '@committed/components'

export default {
  title: 'Components/GraphDebugControl',
  component: GraphDebugControl,
} as Meta

export const Default: React.FC = () => {
  return (
    <ThemeProvider>
      <GraphDebugControl
        model={
          new GraphModel(
            new ContentModel(exampleGraphData.nodes, exampleGraphData.edges)
          )
        }
        onChange={() => {}}
        onReset={() => {}}
      />
    </ThemeProvider>
  )
}
