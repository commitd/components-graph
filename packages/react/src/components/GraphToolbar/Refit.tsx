import { IconButton } from '@committed/ds'
import { GraphModel } from '@committed/graph'
import { mdiArrowExpandAll as refitPath } from '@mdi/js'
import React from 'react'

export type RefitProps = React.ComponentProps<typeof IconButton> & {
  /** Declarative definition of graph state */
  model: GraphModel
  /** The graph model change callback */
  onModelChange: (
    model: GraphModel | ((model2: GraphModel) => GraphModel)
  ) => void
}

/**
 * A GraphToolbar sub-component adds controls for refitting the graph
 */
export const Refit: React.FC<RefitProps> = ({
  model,
  onModelChange,
  ...props
}) => {
  return (
    <IconButton
      aria-label="refit"
      title="Refit"
      path={refitPath}
      onClick={() => onModelChange(model.pushCommand({ type: 'Refit' }))}
      {...props}
    />
  )
}
