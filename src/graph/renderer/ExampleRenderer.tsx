import { Box, Button, Heading, Monospace } from '@committed/components'
import React from 'react'
import { GraphModel } from '../GraphModel'
import { GraphRenderer, GraphRendererOptions } from '../types'

const Renderer: GraphRenderer<GraphRendererOptions>['render'] = ({
  graphModel,
  onChange,
}) => {
  const handleAddNode = (): void => {
    const withNode = graphModel.getCurrentContent().addNode({})
    const newModel = GraphModel.applyContent(graphModel, withNode)
    onChange(newModel)
  }

  const handleAddEdge = (): void => {
    const nodes = Object.values(graphModel.getCurrentContent().nodes)
    if (nodes.length === 0) {
      return
    }
    const node1 = nodes[Math.floor(Math.random() * nodes.length)]
    const node2 = nodes[Math.floor(Math.random() * nodes.length)]
    const withEdge = graphModel.getCurrentContent().addEdge({
      source: node1.id,
      target: node2.id,
    })
    const newModel = GraphModel.applyContent(graphModel, withEdge)
    onChange(newModel)
  }

  return (
    <Box bgcolor="background.paper" p={3}>
      <Button m={2} color="primary" onClick={handleAddNode}>
        Add Node
      </Button>
      <Button m={2} color="primary" onClick={handleAddEdge}>
        Add Edge
      </Button>
      <div>
        <Heading.h2>Nodes</Heading.h2>
        <Monospace fontSize={-2}>
          {JSON.stringify(graphModel.nodes, null, 2)}
        </Monospace>
      </div>
      <div>
        <Heading.h2>Edges</Heading.h2>
        <Monospace fontSize={-2}>
          {JSON.stringify(graphModel.edges, null, 2)}
        </Monospace>
      </div>
      <div></div>
    </Box>
  )
}

export const exampleRenderer: GraphRenderer<GraphRendererOptions> = {
  defaultOptions: {
    height: 300,
  },
  layouts: [],
  render: Renderer,
}
