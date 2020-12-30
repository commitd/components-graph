import { Box, Button, Heading, Monospace } from '@committed/components'
import React from 'react'
import { addRandomEdge, addRandomNode } from '../data'
import { GraphRenderer, GraphRendererOptions } from '../types'

const Renderer: GraphRenderer<GraphRendererOptions>['render'] = ({
  graphModel,
  onChange,
}) => {
  const handleAddNode = (): void => {
    onChange(addRandomNode(graphModel))
  }

  const handleAddEdge = (): void => {
    onChange(addRandomEdge(graphModel))
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
