import { Graph, GraphModel } from '@committed/components-graph'
import { Json, JsonExample } from '@committed/graph-json'
import { Meta } from '@storybook/react'
import React, { useState } from 'react'
import { Template } from './StoryUtil'

const { smallGraph, largeGraph } = JsonExample

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
    GraphModel.createWithContent(Json.buildGraph(smallGraph))
  )
  return <Template model={model} onModelChange={setModel} />
}

export const RichJsonGraph: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.createWithContent(Json.buildGraph(largeGraph))
  )
  return <Template model={model} onModelChange={setModel} />
}
