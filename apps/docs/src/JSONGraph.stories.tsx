import { Alert, AlertContent, AlertTitle, Flex } from '@committed/components'
import { ContentModel, cytoscapeRenderer, Graph, GraphModel, GraphToolbar, Node, NodeViewer } from '@committed/components-graph'
import { Json, JsonExample } from '@committed/graph-json'
import { Meta, Story } from '@storybook/react'
import React, { useEffect, useState } from 'react'
import RJSON from "relaxed-json"
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

const StoryTemplate: Story<{
  json: string
}> = ({
  json,
}) => {
  const [model, setModel] = useState(
    GraphModel.createWithContent(ContentModel.createEmpty())
  )
  const [alert, setAlert] = useState<string | undefined>()

  useEffect(() => {
    try {
      setModel(GraphModel.createWithContent(Json.buildGraph(RJSON.parse(json))))
      setAlert(undefined)
    } catch (error: any) {
      setModel(GraphModel.createWithContent(ContentModel.createEmpty()))
      setAlert(error.message)
    }
  }, [setModel, setAlert, json])

  const [node, setNode] = useState<Node | undefined>(undefined)

  return (
    <>
      {alert && (
        <Alert severity="error">
          <AlertTitle>JSON Error</AlertTitle>
          <AlertContent>{alert}</AlertContent>
        </Alert>
      )}
      <Flex>
        <GraphToolbar
          direction="column"
          model={model}
          onModelChange={setModel}
          layouts={cytoscapeRenderer.layouts}
        />
        <Graph
          model={model}
          onModelChange={setModel}
          renderer={cytoscapeRenderer}
          options={{ height: 600 }}
          onViewNode={setNode}
        />
        <NodeViewer
          open={node != undefined}
          node={node}
          onOpenChange={() => setNode(undefined)}
        />
      </Flex>
    </>
  )
}

export const JsonVisualizer = StoryTemplate.bind({})
JsonVisualizer.args = {
  json: `
/* 
 * We parse this with relaxed-json to make entering the json a little easier
 * http://oleg.fi/relaxed-json/
 */
{
  graph: {
    id: "car-manufacturer-relationships",
    type: "car",
    label: "Car Manufacturer Relationships",
    nodes: {
      nissan: {
        label: "Nissan",
      },
      infiniti: {
        label: "Infiniti",
      },
      toyota: {
        label: "Toyota",
      },
      lexus: {
        label: "Lexus",
      },
    },
    edges: [
      {
        source: "nissan",
        target: "infiniti",
        relation: "has_luxury_division",
      },
      {
        source: "toyota",
        target: "lexus",
        relation: "has_luxury_division",
      },
    ],
  },
} 
`,
}