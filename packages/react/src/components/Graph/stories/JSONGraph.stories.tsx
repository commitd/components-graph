import { GraphBuilder, GraphModel } from '@committed/graph'
import { Meta } from '@storybook/react'
import React, { useState } from 'react'
import { Graph } from '..'
import { Template } from './StoryUtil'
import { samples } from '../../../test/data'

const { smallGraph, largeGraph } = samples.json

export default {
  title: 'Examples/JSONGraph',
  component: Graph,
  decorators: [
    (story) => <div style={{ height: '100h', padding: '16px' }}>{story()}</div>,
  ],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta

export const SimpleJsonGraph: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.createWithContent(GraphBuilder.fromJsonGraph(smallGraph))
  )
  return <Template model={model} onModelChange={setModel} />
}

export const RichJsonGraph: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.createWithContent(GraphBuilder.fromJsonGraph(largeGraph))
  )
  return <Template model={model} onModelChange={setModel} />
}
