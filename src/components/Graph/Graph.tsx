import React, { PropsWithChildren, ReactElement } from 'react'
import { GraphModel } from '../../graph/GraphModel'
import { GraphRenderer, GraphRendererOptions } from '../../graph/types'

export interface GraphProps<O extends GraphRendererOptions> {
  renderer: GraphRenderer<O>
  model: GraphModel
  options: Partial<O> & { height: GraphRendererOptions['height'] }
  onModelChange?: (
    model: GraphModel | ((model2: GraphModel) => GraphModel)
  ) => void
}

export const Graph = <O extends GraphRendererOptions>({
  renderer,
  model,
  onModelChange = () => {
    // do nothing by default
  },
  options,
}: PropsWithChildren<GraphProps<O>>): ReactElement<GraphProps<O>> => {
  return (
    <>
      {renderer.render(model, onModelChange, {
        ...renderer.defaultOptions,
        ...options,
      })}
    </>
  )
}
