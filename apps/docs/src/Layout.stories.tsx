import { Graph, GraphModel, GraphToolbar, LayoutOptions, defaultLayouts, ContentModel, Generator } from '@committed/components-graph'
import { Meta } from '@storybook/react'
import React, { useState } from 'react'
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
      exampleModel.getCurrentLayout().setLayout('circle')
    )
  )
  return <Template model={model} onModelChange={setModel} />
}

export const ColaForceDirectedLayout: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.applyLayout(
      exampleModel,
      exampleModel.getCurrentLayout().setLayout('cola')
    )
  )
  return <Template model={model} onModelChange={setModel} />
}

export const GridLayout: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.applyLayout(
      exampleModel,
      exampleModel.getCurrentLayout().setLayout('grid')
    )
  )
  return <Template model={model} onModelChange={setModel} />
}

export const HierarchicalLayout: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.applyLayout(
      exampleModel,
      exampleModel.getCurrentLayout().setLayout('hierarchical')
    )
  )
  return <Template model={model} onModelChange={setModel} />
}

export const ConcentricLayout: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.applyLayout(
      exampleModel,
      exampleModel.getCurrentLayout().setLayout('concentric')
    )
  )
  return <Template model={model} onModelChange={setModel} />
}

export const BreadthfirstLayout: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.applyLayout(
      exampleModel,
      exampleModel.getCurrentLayout().setLayout('breadth-first')
    )
  )
  return <Template model={model} onModelChange={setModel} />
}


export const CoseLayout: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.applyLayout(
      exampleModel,
      exampleModel.getCurrentLayout().setLayout('cose')
    )
  )
  return <Template model={model} onModelChange={setModel} />
}

export const CustomLayout: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.applyLayout(
      exampleModel,
      exampleModel.getCurrentLayout().setLayout({
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


export const OverrideLayout: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.applyLayout(
      Generator.randomGraph(100, 100),
      exampleModel.getCurrentLayout().setLayout('network-simplex')
    )
  )
  const layoutOptions: Record<string, LayoutOptions> = {
    'network-simplex': { ...defaultLayouts.hierarchical, ranker: 'network-simplex'} as LayoutOptions,
    'inverted': { ...defaultLayouts.hierarchical, ranker: 'network-simplex', transform: (node, position) => {
      return {x: position.x, y: -position.y }
    }} as LayoutOptions,
    'tight-tree': { ...defaultLayouts.hierarchical, ranker: 'tight-tree' }as LayoutOptions,
    'longest-path': { ...defaultLayouts.hierarchical, ranker: 'longest-path' }as LayoutOptions,
    'radial': { ...defaultLayouts['breadth-first'], circle: true }as LayoutOptions,

  }
  
  return <Template model={model} onModelChange={setModel} options={{height: 600, renderOptions: { layoutOptions }}} >
    <GraphToolbar direction='row' model={model} onModelChange={setModel} layouts={[ 'network-simplex', 'inverted', 'tight-tree', 'breadth-first', 'concentric', 'radial']}/>
  </Template>
}