/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CSSProps, IconButton } from '@committed/components'
import { GraphModel } from '@committed/graph'
import { mdiArrowExpandAll as refitPath } from '@mdi/js'
import React from 'react'

export type RefitProps = React.ComponentProps<typeof IconButton> &
  CSSProps & {
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
  css,
  ...props
}) => {
  return (
    <IconButton
      aria-label="refit"
      title="Refit"
      path={refitPath}
      onClick={() => onModelChange(model.pushCommand({ type: 'Refit' }))}
      css={css as any}
      {...props}
    />
  )
}
