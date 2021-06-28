import { Theme } from '@committed/components'
import { Meta } from '@storybook/react'
import React, { useState } from 'react'
import { Graph } from '../'
import { ContentModel, DecoratorModel, GraphModel } from '../../../graph'
import {
  addRandomEdge,
  addRandomNodeColors,
  addRandomNodeShapes,
} from '../../../graph/data/Generator'
import { ModelNode, NodeDecoration } from '../../../graph/types'
import { exampleGraphData } from './exampleData'
import { Template } from './StoryUtil'

export default {
  title: 'Examples/Decoration',
  component: Graph,
  decorators: [
    (story) => <div style={{ height: '50vh', padding: '16px' }}>{story()}</div>,
  ],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta

export const NodeShapes: React.FC = () => {
  const [model, setModel] = useState(
    addRandomEdge(addRandomNodeShapes(GraphModel.createEmpty(), 20), 15)
  )
  return <Template model={model} onModelChange={setModel} />
}

export const NodeColors: React.FC = () => {
  const [model, setModel] = useState(
    addRandomEdge(addRandomNodeColors(GraphModel.createEmpty(), 20), 15)
  )
  return <Template model={model} onModelChange={setModel} />
}

export const TypedDecoration: React.FC = () => {
  const [model, setModel] = useState(
    new GraphModel(ContentModel.fromRaw(exampleGraphData), {
      decoratorModel: DecoratorModel.createDefault({
        nodeDecorators: [
          (node: ModelNode, theme: Theme): Partial<NodeDecoration> => {
            const type = node.attributes['type']
            if (type === 'person') return { color: theme.palette.info.main }
            if (type === 'place') return { color: theme.palette.success.main }
            return { color: '#00FF00' }
          },
        ],
      }),
    })
  )

  return <Template model={model} onModelChange={setModel} />
}

export const CustomIcons: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.createWithContent(
      new ContentModel(
        {
          chris: {
            id: 'chris',
            attributes: {},
            label: 'Chris Flatley',
            icon: 'https://committed.software/static/chris-e5738250e4525dd9c6783ea3802c814f.jpg',
            size: 100,
          },
          stuart: {
            id: 'stuart',
            attributes: {},
            label: 'Stuart Hendren',
            icon: 'https://committed.software/static/stuart-faed1d5684aa9dd6d7cc20fff9e34e8e.png',
            size: 100,
          },
          jon: {
            id: 'jon',
            attributes: {},
            label: 'Jon Elliot',
            icon: 'https://committed.software/static/jon-809f2f941386ebb56949c0b3f5dae221.png',
            size: 100,
          },
          steve: {
            id: 'steve',
            attributes: {},
            label: 'Steven Taylor',
            icon: 'https://committed.software/static/steve-70f3e007ab54a82ef7c7ab8a7989ebc3.jpg',
            size: 100,
          },
          matt: {
            id: 'matt',
            attributes: {},
            label: 'Matt Copas',
            icon: 'https://committed.software/static/matt-2db182f3e2a621017e7ef4cffda2ee3f.jpg',
            size: 100,
          },
          kristian: {
            id: 'kristian',
            attributes: {},
            label: 'Kristian Aspinall',
            icon: 'https://committed.software/static/kristian-4508fcd63e07690867e4c39b51bdd685.jpg',
            size: 100,
          },
        },
        {
          e1: {
            id: 'e1',
            attributes: {},
            source: 'chris',
            target: 'stuart',
          },
          e2: {
            id: 'e2',
            attributes: {},
            source: 'stuart',
            target: 'jon',
          },
          e3: {
            id: 'e3',
            attributes: {},
            source: 'kristian',
            target: 'steve',
          },
          e4: {
            id: 'e4',
            attributes: {},
            source: 'matt',
            target: 'kristian',
          },
          e5: {
            id: 'e5',
            attributes: {},
            source: 'jon',
            target: 'matt',
          },
          e6: {
            id: 'e6',
            attributes: {},
            source: 'jon',
            target: 'steve',
          },
          e7: {
            id: 'e7',
            attributes: {},
            source: 'chris',
            target: 'steve',
          },
        }
      )
    )
  )
  return <Template model={model} onModelChange={setModel} />
}
