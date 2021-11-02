import {
  Generator,
  ContentModel,
  DecoratorModel,
  GraphModel,
  ModelNode,
  NodeDecoration,
  sizeNodeBy,
} from '@committed/graph'
import { Meta } from '@storybook/react'
import React, { useState } from 'react'
import { Graph } from '../'
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
  const [model, setModel] = useState(() =>
    Generator.addRandomEdge(
      Generator.addRandomNodeShapes(GraphModel.createEmpty(), 20),
      15
    )
  )
  return <Template model={model} onModelChange={setModel} />
}

export const NodeColors: React.FC = () => {
  const [model, setModel] = useState(
    Generator.addRandomEdge(
      Generator.addRandomNodeColors(GraphModel.createEmpty(), 20),
      15
    )
  )
  return <Template model={model} onModelChange={setModel} />
}

export const TypedDecoration: React.FC = () => {
  const [model, setModel] = useState(
    new GraphModel(ContentModel.fromRaw(exampleGraphData), {
      decoratorModel: DecoratorModel.createDefault({
        nodeDecorators: [
          (node: ModelNode): Partial<NodeDecoration> => {
            const type = node.attributes['type']
            if (type === 'person') return { color: '$colors$info' }
            if (type === 'place') return { color: '$colors$success' }
            return { color: '#00FF00' }
          },
        ],
      }),
    })
  )

  return <Template model={model} onModelChange={setModel} />
}

export const AttributeDecoration: React.FC = () => {
  const [model, setModel] = useState(
    () =>
      new GraphModel(Generator.randomGraph().getCurrentContent(), {
        decoratorModel: DecoratorModel.createDefault({
          nodeDecorators: [
            sizeNodeBy((node: ModelNode) => {
              return [node.label?.length || 8, [8, 30]]
            }),
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
            icon: 'https://committed.io/static/chris-4f65af02b0d026c76bfbac1aa90461c3.jpg',
            size: 100,
          },
          stuart: {
            id: 'stuart',
            attributes: {},
            label: 'Stuart Hendren',
            icon: 'https://committed.io/static/stuart-c12a4df0a720f9252abb8279ffa9f7c8.png',
            size: 100,
          },
          jon: {
            id: 'jon',
            attributes: {},
            label: 'Jon Elliot',
            icon: 'https://committed.io/static/jon-4f56f1e3f4369e4d115d3a88195a2f4a.png',
            size: 100,
          },
          steve: {
            id: 'steve',
            attributes: {},
            label: 'Steven Taylor',
            icon: 'https://committed.io/static/steve-282e9f5032489e7a4274ee5eec6fd206.jpg',
            size: 100,
          },
          matt: {
            id: 'matt',
            attributes: {},
            label: 'Matt Copas',
            icon: 'https://committed.io/static/matt-e622c816a3d4f6c831346da257ed6500.jpg',
            size: 100,
          },
          kristian: {
            id: 'kristian',
            attributes: {},
            label: 'Kristian Aspinall',
            icon: 'https://committed.io/static/kristian-d0ae8e222bf08ea15acba90d5a41b2aa.jpg',
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
