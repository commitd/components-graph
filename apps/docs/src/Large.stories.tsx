import { Generator, Graph, GraphModel } from '@committed/components-graph'
import { Meta } from '@storybook/react'
import React, { useState } from 'react'
import { exampleModel, Template } from './StoryUtil'

export default {
  title: 'Examples/Large',
  component: Graph,
  decorators: [
    (story) => <div style={{ height: '100h', padding: '16px' }}>{story()}</div>,
  ],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta

export const LargeGraph: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.applyLayout(
      Generator.addRandomEdge(
        Generator.addRandomNode(GraphModel.createEmpty(), 500, {
          shape: 'ellipse',
        }),
        300
      ),
      exampleModel.getCurrentLayout().presetLayout('force-directed')
    )
  )
  return <Template model={model} onModelChange={setModel} />
}
