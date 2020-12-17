import React from 'react'
import { GraphModel } from '../GraphModel'
import { GraphRenderer, GraphRendererOptions } from '../types'

const Renderer: GraphRenderer<GraphRendererOptions>['render'] = ({
  graphModel,
  onChange,
}) => {
  const handleAddNode = (): void => {
    const withNode = graphModel.getCurrentContent().addNode({})
    const newModel = GraphModel.applyContent(graphModel, withNode)
    onChange(newModel)
  }

  const handleAddEdge = (): void => {
    const nodes = Object.values(graphModel.getCurrentContent().nodes)
    if (nodes.length === 0) {
      return
    }
    const node1 = nodes[Math.floor(Math.random() * nodes.length)]
    const node2 = nodes[Math.floor(Math.random() * nodes.length)]
    const withEdge = graphModel.getCurrentContent().addEdge({
      source: node1.id,
      target: node2.id,
      targetArrow: true,
    })
    const newModel = GraphModel.applyContent(graphModel, withEdge)
    onChange(newModel)
  }

  return (
    <div>
      <div>Nodes {JSON.stringify(graphModel.nodes, null, '\t')}</div>
      <div>Edges {JSON.stringify(graphModel.edges, null, '\t')}</div>
      <div>
        <button onClick={handleAddNode}>Add Node</button>{' '}
        <button onClick={handleAddEdge}>Add Edge</button>
      </div>
    </div>
  )
}

export const exampleRenderer: GraphRenderer<GraphRendererOptions> = {
  defaultOptions: {
    height: 300,
  },
  layouts: [],
  render: Renderer,
}
