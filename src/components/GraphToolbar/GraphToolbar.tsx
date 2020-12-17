import { Box, Flex, IconButton, IconButtonProps } from '@committed/components'
import { ZoomIn, ZoomOut, ZoomOutMap, Timeline } from '@material-ui/icons'
import React from 'react'
import { GraphModel } from '../../graph/GraphModel'

export interface GraphToolbarProps extends IconButtonProps {
  direction: 'row' | 'column'
  model: GraphModel
  onModelChange: (
    model: GraphModel | ((model2: GraphModel) => GraphModel)
  ) => void
}

/**
 * GraphToolbar component
 */
export const GraphToolbar: React.FC<GraphToolbarProps> = ({
  direction,
  model,
  onModelChange,
  ...props
}) => {
  return (
    <Box>
      <Flex flexDirection={direction}>
        <IconButton
          aria-label="zoom-in"
          {...props}
          onClick={() => onModelChange(model.pushCommand({ type: 'ZoomIn' }))}
        >
          <ZoomIn />
        </IconButton>
        <IconButton
          aria-label="zoom-out"
          {...props}
          onClick={() => onModelChange(model.pushCommand({ type: 'ZoomOut' }))}
        >
          <ZoomOut />
        </IconButton>
        <IconButton
          aria-label="layout"
          {...props}
          onClick={() => onModelChange(model.pushCommand({ type: 'Layout' }))}
        >
          <Timeline />
        </IconButton>
        <IconButton
          aria-label="refit"
          {...props}
          onClick={() => onModelChange(model.pushCommand({ type: 'Refit' }))}
        >
          <ZoomOutMap />
        </IconButton>
      </Flex>
    </Box>
  )
}
