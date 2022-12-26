import { Box, Button, Flex, Select, SelectItem } from '@committed/components'
import { Generator, GraphModel, PresetGraphLayout } from '@committed/graph'
import { defaultLayouts } from '../../graph'
import React from 'react'

const { addRandomNode, addRandomEdge, removeRandomNode, removeRandomEdge } =
  Generator

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
      <Flex css={{ flexWrap: 'wrap', gap: '$2' }}>
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
        <Button onClick={onReset} destructive>
          Reset
        </Button>
      </Flex>
      <Box css={{ mt: '$2' }}>
        <Select
          label="Layout"
          value={model.getCurrentLayout().getLayout().toString()}
          onValueChange={(newValue) =>
            onChange(
              GraphModel.applyLayout(
                model,
                model
                  .getCurrentLayout()
                  .presetLayout(newValue as PresetGraphLayout)
              )
            )
          }
        >
          {Object.keys(defaultLayouts).map((l) => (
            <SelectItem key={l} value={l}>
              {l}
            </SelectItem>
          ))}
        </Select>
      </Box>
    </div>
  )
}
