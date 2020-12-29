import { Box, Flex } from '@committed/components'
import { Meta } from '@storybook/react'
import React, { useState } from 'react'
import { Graph } from '.'
import { cytoscapeRenderer } from '../../graph'
import { GraphDebugControl } from '../GraphDebugControl'
import { exampleModel } from './stories/StoryUtil'

export default {
  title: 'Components/Graph',
  component: Graph,
  decorators: [
    (story) => <div style={{ height: '50vh', padding: '16px' }}>{story()}</div>,
  ],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta

export const Sandbox: React.FC = () => {
  const [model, setModel] = useState(exampleModel)
  return (
    <Flex flexDirection="column" height={1}>
      <Box mb={2}>
        <GraphDebugControl
          model={model}
          onChange={setModel}
          onReset={() => setModel(exampleModel)}
        />
      </Box>
      <Box flex={1}>
        <Graph
          model={model}
          onModelChange={setModel}
          renderer={cytoscapeRenderer}
          options={{ height: 'full-height' }}
        />
      </Box>
    </Flex>
  )
}
