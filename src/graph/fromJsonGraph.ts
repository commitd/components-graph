import { ContentModel } from './ContentModel'
import {
  JSONGraph,
  JSONGraphData,
  JSONGraphNode,
  ModelEdge,
  ModelNode,
} from './types'

export function fromJsonGraph(data: JSONGraphData | JSONGraph): ContentModel {
  let graphData: JSONGraph
  if ('nodes' in data) {
    graphData = data
  } else {
    if (data.graph !== undefined) {
      graphData = data.graph
    } else if (data.graphs?.length === 1) {
      graphData = data.graphs[0]
    } else {
      throw new Error(`Only a single graph is supported`)
    }
  }
  if ('hyperedges' in graphData) {
    throw new Error(`Hyper edges are not supported`)
  }

  let model = Object.entries(graphData.nodes).reduce((acc, entry) => {
    const node: ModelNode = { id: entry[0], attributes: {} }
    const jsonNode: JSONGraphNode = entry[1]
    if (jsonNode.label !== undefined) {
      node.label = jsonNode.label
    }
    if (jsonNode.metadata !== undefined) {
      node.attributes = jsonNode.metadata
    }
    return acc.addNode(node)
  }, ContentModel.createEmpty())
  model = Object.values(graphData.edges).reduce((acc, jsonEdge) => {
    const edge: Omit<ModelEdge, 'id'> & { id?: string } = {
      source: jsonEdge.source,
      target: jsonEdge.target,
      attributes: {},
    }
    if (jsonEdge.id !== undefined) {
      edge.id = jsonEdge.id
    }
    if (jsonEdge.label !== undefined || jsonEdge.relation !== undefined) {
      edge.label = jsonEdge.label ?? jsonEdge.relation
    }
    if (jsonEdge.metadata !== undefined) {
      edge.attributes = jsonEdge.metadata
    }
    if (jsonEdge.relation !== undefined) {
      edge.attributes.relation = jsonEdge.relation
    }
    return acc.addEdge(edge)
  }, model)
  return model
}
