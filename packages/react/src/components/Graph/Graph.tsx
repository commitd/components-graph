import { DecoratedNode, GraphModel } from '@committed/graph'
import React, { PropsWithChildren, ReactElement } from 'react'
import { GraphRenderer, GraphRendererOptions } from '../../graph/types'

export interface GraphProps<O extends GraphRendererOptions> {
  /** Pluggable GraphRender interface to create a React Component using the GraphModel  */
  renderer: GraphRenderer<O>
  /** Declarative definition of graph state */
  model: GraphModel
  /** Options specific to the chosen GraphRenderer */
  options: Partial<O> & { height: GraphRendererOptions['height'] }
  /** The graph model change callback */
  onModelChange: (
    model: GraphModel | ((model2: GraphModel) => GraphModel)
  ) => void
  onViewNode?: (node: DecoratedNode) => void
}

/**
 * The Graph component renders a Graph defined by the GraphModel. How it is rendered is determined by the GraphRenderer
 *
 */
export const Graph = <O extends GraphRendererOptions>({
  renderer,
  model,
  onModelChange,
  onViewNode,
  options,
}: PropsWithChildren<GraphProps<O>>): ReactElement<GraphProps<O>> => {
  return (
    <>
      {renderer.render({
        graphModel: model,
        onChange: onModelChange,
        onViewNode,
        options: {
          ...renderer.defaultOptions,
          ...options,
        },
      })}
    </>
  )
}
