import React, { PropsWithChildren, ReactElement } from 'react'
import { GraphModel } from '../../graph/GraphModel'
import { GraphRenderer, GraphRendererOptions } from '../../graph/types'

export interface GraphProps<O extends GraphRendererOptions> {
  /** Pluggable GraphRender interface to create a React Component using the GraphModel  */
  renderer: GraphRenderer<O>
  /** Declarative definition of graph state */
  model: GraphModel
  /** Options specific to the chosen GraphRenderer */
  options: Partial<O> & { height: GraphRendererOptions['height'] }
  /** The graph model change callback */
  onModelChange?: (
    model: GraphModel | ((model2: GraphModel) => GraphModel)
  ) => void
}

/**
 * The Graph component renders a Graph defined by the GraphModel. How it is rendered is determined by the GraphRenderer
 *
 * @param param0 The options object for the chosen GraphRenderer
 */
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
      {renderer.render({
        graphModel: model,
        onChange: onModelChange,
        options: {
          ...renderer.defaultOptions,
          ...options,
        },
      })}
    </>
  )
}
