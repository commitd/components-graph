import { Box, Column } from '@committed/components'
import { Meta } from '@storybook/react'
import React, { useState } from 'react'
import { Graph, cytoscapeRenderer, GraphDebugControl,} from '@committed/components-graph'
import { exampleModel } from './StoryUtil'

export default {
  title: 'Components/Graph',
  component: Graph,
  parameters: {
    layout: 'padded',
  },
} as Meta

export const Sandbox: React.FC = () => {
  const [model, setModel] = useState(exampleModel)
  return (
    <Column css={{ height: '90vh' }}>
      <Box css={{ mb: '$2' }}>
        <GraphDebugControl
          model={model}
          onChange={setModel}
          onReset={() => setModel(exampleModel)}
        />
      </Box>
      <Box css={{ flex: '1' }}>
        <Graph
          model={model}
          onModelChange={setModel}
          renderer={cytoscapeRenderer}
          options={{ height: 'full-height' }}
        />
      </Box>
    </Column>
  )
}
