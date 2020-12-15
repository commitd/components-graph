import { Box, Button, Flex, MenuItem, TextField } from '@committed/components'
import React from 'react'
import { GraphModel } from '../../graph/GraphModel'
import {
  addRandomEdge,
  addRandomNode,
  removeRandomEdge,
  removeRandomNode,
} from '../../graph/data/Generator'
import { PresetGraphLayout } from '../../graph/types'

export interface GraphDebugControlProps {
  model: GraphModel
  onChange: (model: GraphModel | ((model2: GraphModel) => GraphModel)) => void
  onReset: () => void
}

export const GraphDebugControl: React.FC<GraphDebugControlProps> = ({
  model,
  onChange,
  onReset,
}) => {
  return (
    <div>
      <Flex flexWrap="wrap" gap={2}>
        <Button onClick={() => onChange(addRandomNode(model, 1))}>
          Add Node
        </Button>
        <Button onClick={() => onChange(addRandomNode(model, 10))}>
          Add 10 Nodes
        </Button>
        <Button onClick={() => onChange(addRandomNode(model, 100))}>
          Add 100 Nodes
        </Button>
        <Button onClick={() => onChange(addRandomEdge(model, 1))}>
          Add Edge
        </Button>
        <Button onClick={() => onChange(addRandomEdge(model, 10))}>
          Add 10 Edges
        </Button>
        <Button onClick={() => onChange(addRandomEdge(model, 100))}>
          Add 100 Edges
        </Button>
        <Button onClick={() => onChange(removeRandomNode(model))}>
          Remove Random Node
        </Button>
        <Button onClick={() => onChange(removeRandomEdge(model))}>
          Remove Random Edge
        </Button>
        <Button
          onClick={() =>
            onChange(
              GraphModel.applyLayout(
                model,
                model.getCurrentLayout().invalidate()
              )
            )
          }
        >
          Layout
        </Button>
        <Button onClick={onReset}>Reset</Button>
      </Flex>
      <Box mt={2}>
        <TextField
          select
          label="Layout"
          value={model.getCurrentLayout().getLayout()}
          onChange={(e) =>
            onChange(
              GraphModel.applyLayout(
                model,
                model
                  .getCurrentLayout()
                  .presetLayout(e.target.value as PresetGraphLayout)
              )
            )
          }
        >
          {['force-directed', 'circle', 'grid', 'cola'].map((l) => (
            <MenuItem key={l} value={l}>
              {l}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </div>
  )
}
