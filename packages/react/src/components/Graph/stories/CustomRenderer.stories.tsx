import { GraphModel } from '@committed/graph'
import { Meta } from '@storybook/react'
import React, { useState } from 'react'
import { Graph } from '../'
import { exampleRenderer } from '../../../graph/renderer/ExampleRenderer'

export default {
  title: 'Examples/CustomRenderer',
  component: Graph,
  decorators: [
    (story) => <div style={{ height: '100h', padding: '16px' }}>{story()}</div>,
  ],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta

export const CustomRenderer: React.FC<{ initialModel?: GraphModel }> = ({
  initialModel = GraphModel.createEmpty(),
}) => {
  const [model, setModel] = useState(initialModel)
  return (
    <Graph
      model={model}
      onModelChange={setModel}
      renderer={exampleRenderer}
      options={{ height: 600 }}
    />
  )
}
