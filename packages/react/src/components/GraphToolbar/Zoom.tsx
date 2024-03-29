/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CSSProps, IconButton } from '@committed/components'
import { GraphModel } from '@committed/graph'
import {
  mdiMagnifyMinus as zoomOutPath,
  mdiMagnifyPlus as zoomInPath,
} from '@mdi/js'
import React from 'react'

export type ZoomProps = React.ComponentProps<typeof IconButton> &
  CSSProps & {
    /** Declarative definition of graph state */
    model: GraphModel
    /** The graph model change callback */
    onModelChange: (
      model: GraphModel | ((model2: GraphModel) => GraphModel)
    ) => void
  }

/**
 * A GraphToolbar sub-component adds controls for zooming in and out of the graph
 */
export const Zoom: React.VFC<ZoomProps> = ({
  model,
  onModelChange,
  css,
  ...props
}) => {
  return (
    <>
      <IconButton
        aria-label="zoom-in"
        title="Zoom in"
        path={zoomInPath}
        onClick={() => onModelChange(model.pushCommand({ type: 'ZoomIn' }))}
        css={css as any}
        {...props}
      />
      <IconButton
        aria-label="zoom-out"
        title="Zoom out"
        path={zoomOutPath}
        onClick={() => onModelChange(model.pushCommand({ type: 'ZoomOut' }))}
        css={css as any}
        {...props}
      />
    </>
  )
}
