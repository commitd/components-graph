import { Box, Row, Button, Heading, Monospace } from '@committed/components'
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
    <Box css={{ backgroundColor: '$paper', p: '$3' }}>
      <Button css={{ m: '$3' }} onClick={handleAddNode}>
        Add Node
      </Button>
      <Button css={{ m: '$3' }} onClick={handleAddEdge}>
        Add Edge
      </Button>
      <Row css={{ flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
        <div>
          <Heading variant="h5" size={1}>
            Nodes:
          </Heading>
          <Monospace size={-2}>
            {JSON.stringify(graphModel.nodes, null, 2)}
          </Monospace>
        </div>
        <div>
          <Heading variant="h5" size={1}>
            Edges:{' '}
          </Heading>
          <Monospace size={-2}>
            {JSON.stringify(graphModel.edges, null, 2)}
          </Monospace>
        </div>
      </Row>
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
