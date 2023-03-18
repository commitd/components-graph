import {
  ContentModel,
  DecoratorModel, Generator, Graph, GraphModel,
  ModelNode,
  Node,
  NodeDecoration,
  sizeNodeBy
} from '@committed/components-graph'
import { faker } from '@faker-js/faker'
import { Meta } from '@storybook/react'
import React, { useState } from 'react'
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
          (node: Node): Partial<NodeDecoration> => {
            const type = node.metadata['type']
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
          n1: {
            id: 'n1',
            metadata: {},
            label: faker.name.fullName(),
            icon: 'https://i.pravatar.cc/100',
            size: 100,
          },
          n2: {
            id: 'n2',
            metadata: {},
            label: faker.name.fullName(),
            icon: 'https://i.pravatar.cc/100',
            size: 100,
          },
          n3: {
            id: 'n3',
            metadata: {},
            label: faker.name.fullName(),
            size: 100,
          },
          n4: {
            id: 'n4',
            metadata: {},
            label: faker.name.fullName(),
            icon: 'https://i.pravatar.cc/100',
            size: 100,
          },
          n5: {
            id: 'n5',
            metadata: {},
            label: faker.name.fullName(),
            icon: 'https://i.pravatar.cc/100',
            size: 100,
          },
          n6: {
            id: 'n6',
            metadata: {},
            label: faker.name.fullName(),
            icon: 'https://i.pravatar.cc/100',
            size: 100,
          },
        },
        {
          e1: {
            id: 'e1',
            label: '',
            metadata: {},
            source: 'n1',
            target: 'n2',
            directed: true
          },
          e2: {
            id: 'e2',
            label: '',
            metadata: {},
            source: 'n2',
            target: 'n3',
            directed: true
          },
          e3: {
            id: 'e3',
            label: '',
            metadata: {},
            source: 'n6',
            target: 'n4',
            directed: true
          },
          e4: {
            id: 'e4',
            label: '',
            metadata: {},
            source: 'n5',
            target: 'n6',
            directed: true
          },
          e5: {
            id: 'e5',
            label: '',
            metadata: {},
            source: 'n3',
            target: 'n5',
            directed: true
          },
          e6: {
            id: 'e6',
            label: '',
            metadata: {},
            source: 'n3',
            target: 'n4',
            directed: true
          },
          e7: {
            id: 'e7',
            label: '',
            metadata: {},
            source: 'n1',
            target: 'n4',
            directed: true
          },
        }
      )
    )
  )
  return <Template model={model} onModelChange={setModel} />
}
