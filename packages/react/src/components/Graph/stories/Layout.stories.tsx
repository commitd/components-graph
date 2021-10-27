import { Meta } from '@storybook/react'
import React, { useState } from 'react'
import { Graph } from '..'
import { GraphModel } from '../../../graph'
import { exampleModel, Template } from './StoryUtil'

export default {
  title: 'Examples/Layouts',
  component: Graph,
  decorators: [
    (story) => <div style={{ height: '50vh', padding: '16px' }}>{story()}</div>,
  ],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta

export const ForceDirectedLayout: React.FC = () => {
  const [model, setModel] = useState(exampleModel)
  return <Template model={model} onModelChange={setModel} />
}

export const CircleLayout: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.applyLayout(
      exampleModel,
      exampleModel.getCurrentLayout().presetLayout('circle')
    )
  )
  return <Template model={model} onModelChange={setModel} />
}

export const ColaForceDirectedLayout: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.applyLayout(
      exampleModel,
      exampleModel.getCurrentLayout().presetLayout('cola')
    )
  )
  return <Template model={model} onModelChange={setModel} />
}

export const GridLayout: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.applyLayout(
      exampleModel,
      exampleModel.getCurrentLayout().presetLayout('grid')
    )
  )
  return <Template model={model} onModelChange={setModel} />
}

export const CustomLayout: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.applyLayout(
      exampleModel,
      exampleModel.getCurrentLayout().customLayout({
        name: 'Alphabetical',
        runLayout: (m) => {
          return m.nodes.reduce<Record<string, cytoscape.Position>>(
            (prev, next) => {
              prev[next.id] = {
                x: ((next?.label?.charCodeAt(0) ?? 0) - 65) * 40 + 50,
                y: 200,
              }
              return prev
            },
            {}
          )
        },
        stopLayout: () => {},
      })
    )
  )
  return <Template model={model} onModelChange={setModel} />
}
