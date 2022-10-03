import { Box, Button, Heading, Monospace, Row } from '@committed/components'
import { Generator, GraphRenderer, GraphRendererOptions } from '@committed/components-graph'
import React from 'react'

const Renderer: GraphRenderer<GraphRendererOptions>['render'] = ({
  graphModel,
  onChange,
}) => {
  const handleAddNode = (): void => {
    onChange(Generator.addRandomNode(graphModel))
  }

  const handleAddEdge = (): void => {
    onChange(Generator.addRandomEdge(graphModel))
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
