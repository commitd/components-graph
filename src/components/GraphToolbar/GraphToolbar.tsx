import {
  Flex,
  FlexProps,
  IconButton,
  IconButtonProps,
} from '@committed/components'
import { Timeline, ZoomIn, ZoomOut, ZoomOutMap } from '@material-ui/icons'
import React from 'react'
import { GraphModel } from '../../graph/GraphModel'

export interface GraphToolbarProps extends Omit<FlexProps, 'flexDirection'> {
  /** Declarative definition of graph state */
  model: GraphModel
  /** The graph model change callback */
  onModelChange: (
    model: GraphModel | ((model2: GraphModel) => GraphModel)
  ) => void
  /** The direction of the toolbar */
  flexDirection?: 'row' | 'column'
  /** Props passed to all icons */
  iconProps?: Omit<IconButtonProps, 'onClick'>
}

/**
 * GraphToolbar component adds controls for zoom, layout and refit.
 *
 * Also supports flex props to control layout of toolbar.
 */
export const GraphToolbar: React.FC<GraphToolbarProps> = ({
  model,
  onModelChange,
  iconProps,
  ...props
}) => {
  return (
    <Flex {...props}>
      <IconButton
        aria-label="zoom-in"
        title="Zoom in"
        {...iconProps}
        onClick={() => onModelChange(model.pushCommand({ type: 'ZoomIn' }))}
      >
        <ZoomIn />
      </IconButton>
      <IconButton
        aria-label="zoom-out"
        title="Zoom out"
        {...iconProps}
        onClick={() => onModelChange(model.pushCommand({ type: 'ZoomOut' }))}
      >
        <ZoomOut />
      </IconButton>
      <IconButton
        aria-label="layout"
        title="Layout"
        {...iconProps}
        onClick={() => onModelChange(model.pushCommand({ type: 'Layout' }))}
      >
        <Timeline />
      </IconButton>
      <IconButton
        aria-label="refit"
        title="Refit"
        {...iconProps}
        onClick={() => onModelChange(model.pushCommand({ type: 'Refit' }))}
      >
        <ZoomOutMap />
      </IconButton>
    </Flex>
  )
}
