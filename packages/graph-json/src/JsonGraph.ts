import { ContentModel, Edge, Node } from '@committed/graph'
import { v4 } from 'uuid'

/// JSON GRAPH Interfaces - only describes what we need from
/// https://github.com/jsongraph/json-graph-specification/blob/master/json-graph-schema_v2.json
/// Note we do not support hyperedges

export interface GraphNode {
  label?: string
  metadata?: Record<string, unknown>
}

export interface GraphEdge {
  id?: string
  source: string
  target: string
  relation?: string
  directed?: boolean
  label?: string
  metadata?: Record<string, unknown>
}

export interface Graph {
  nodes: Record<string, GraphNode>
  edges: GraphEdge[]
}

export interface GraphData {
  graph?: Graph
  graphs?: Graph[]
}

function getGraphData(data: Graph | GraphData): Graph {
  let graphData: Graph
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
  return graphData
}

function getNodes(graphData: Graph) {
  return Object.entries(graphData.nodes).reduce<Record<string, Node>>(
    (acc, entry) => {
      const node: Node = { id: entry[0], metadata: {} }
      const jsonNode: GraphNode = entry[1]
      if (jsonNode.label !== undefined) {
        node.label = jsonNode.label
      }
      if (jsonNode.metadata !== undefined) {
        node.metadata = jsonNode.metadata
      }
      acc[node.id] = node
      return acc
    },
    {}
  )
}

function getEdges(graphData: Graph) {
  return Object.values(graphData.edges).reduce<Record<string, Edge>>(
    (acc, jsonEdge) => {
      const edge: Edge = {
        id: jsonEdge.id ?? v4(),
        source: jsonEdge.source,
        target: jsonEdge.target,
        directed: true,
        metadata: {},
      }
      if (jsonEdge.id !== undefined) {
        edge.id = jsonEdge.id
      }
      if (jsonEdge.label !== undefined || jsonEdge.relation !== undefined) {
        edge.label = jsonEdge.label ?? jsonEdge.relation
      }
      if (jsonEdge.metadata !== undefined) {
        edge.metadata = jsonEdge.metadata
      }
      if (jsonEdge.relation !== undefined) {
        edge.metadata.relation = jsonEdge.relation
      }
      if (jsonEdge.directed !== undefined) {
        edge.directed = jsonEdge.directed
      }
      acc[edge.id] = edge
      return acc
    },
    {}
  )
}

export function buildGraph(data: GraphData | Graph): ContentModel {
  const graphData = getGraphData(data)
  const nodes = getNodes(graphData)
  const edges = getEdges(graphData)
  return new ContentModel(nodes, edges)
}
