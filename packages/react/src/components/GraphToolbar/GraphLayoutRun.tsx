/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { IconButton } from '@committed/ds'
import { GraphModel } from '@committed/graph'
import { mdiChartTimelineVariant as layoutPath } from '@mdi/js'
import React from 'react'

export type GraphLayoutRunProps = React.ComponentProps<typeof IconButton> & {
  /** Declarative definition of graph state */
  model: GraphModel
  /** The graph model change callback */
  onModelChange: (
    model: GraphModel | ((model2: GraphModel) => GraphModel)
  ) => void
}

/**
 * GraphLayoutRun component adds controls to run the graph layout.
 */
export const GraphLayoutRun: React.FC<GraphLayoutRunProps> = ({
  model,
  onModelChange,
  ...props
}) => {
  return (
    <IconButton
      aria-label="layout"
      title="Layout"
      path={layoutPath}
      onClick={() => onModelChange(model.pushCommand({ type: 'Layout' }))}
      {...props}
    />
  )
}
