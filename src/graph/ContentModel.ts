import {
  ModelNode,
  ModelEdge,
  ModelGraphData,
  ModelAttributeSet,
  JSONGraphData,
  JSONGraph,
  JSONGraphNode,
} from './types'
import { v4 } from 'uuid'

export class ContentModel {
  public static fromRaw(data: ModelGraphData): ContentModel {
    let model = Object.values(data.nodes).reduce(
      (acc, node) => acc.addNode(node),
      ContentModel.createEmpty()
    )
    model = Object.values(data.edges).reduce(
      (acc, edge) => acc.addEdge(edge),
      model
    )
    return model
  }

  public static fromJsonGraph(data: JSONGraphData | JSONGraph): ContentModel {
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

  public static createEmpty(): ContentModel {
    return new ContentModel({}, {})
  }

  constructor(
    readonly nodes: Record<string, ModelNode>,
    readonly edges: Record<string, ModelEdge>
  ) {
    this.nodes = nodes
    this.edges = edges
  }

  containsNode(id: string): boolean {
    return this.getNode(id) != null
  }

  containsEdge(id: string): boolean {
    return this.getEdge(id) != null
  }

  getNode(id: string): ModelNode | undefined {
    return this.nodes[`${id}`]
  }

  private getExistingNode(id: string): ModelNode {
    const node = this.getNode(id)
    if (node == null) {
      throw new Error(`Node [${id}] does not exist`)
    }
    return node
  }

  getEdgesLinkedToNode(nodeId: string): ModelEdge[] {
    return Object.values(this.edges).filter(
      (e) => e.target === nodeId || e.source === nodeId
    )
  }

  addNode(node: Partial<ModelNode>): ContentModel {
    if (node.id != null && this.containsNode(node.id)) {
      throw new Error(`Cannot add node already in graph (${node.id})`)
    }
    const newNode: ModelNode = {
      id: node.id ?? v4(),
      attributes: node.attributes ?? {},
      ...node,
    }
    const nodes = { ...this.nodes, [newNode.id]: newNode }
    return new ContentModel(nodes, this.edges)
  }

  editNode(node: ModelNode): ContentModel {
    this.getExistingNode(node.id)
    return new ContentModel(
      { ...this.nodes, ...{ [node.id]: node } },
      this.edges
    )
  }

  addNodeAttribute<V>(
    id: string,
    attributeName: string,
    attributeValue: V
  ): ContentModel {
    const node = this.getExistingNode(id)
    const newAttributes = {
      ...node.attributes,
      ...{ [attributeName]: attributeValue },
    }
    const changedNode = {
      ...this.getExistingNode(id),
      ...{ attributes: newAttributes },
    }
    return this.editNode(changedNode)
  }

  /**
   * Remove node and associated edges
   * @param id id of the node
   */
  removeNode(id: string): ContentModel {
    const node = this.getNode(id)
    if (node == null) {
      return this
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let content: ContentModel = this
    this.getEdgesLinkedToNode(id).forEach((e) => {
      content = content.removeEdge(e.id)
    })
    return content.removeOrphanNode(id)
  }

  private removeOrphanNode(id: string): ContentModel {
    const withoutNode = { ...this.nodes }
    delete withoutNode[`${id}`]
    return new ContentModel(withoutNode, this.edges)
  }

  editNodeAttribute<V>(
    id: string,
    attributeName: string,
    attributeValue: V
  ): ContentModel {
    if (this.getExistingNode(id).attributes[`${attributeName}`] == null) {
      throw new Error(`Node [${id}] does not have attribute ${attributeName}`)
    }
    return this.addNodeAttribute(id, attributeName, attributeValue)
  }

  removeNodeAttribute(id: string, attributeName: string): ContentModel {
    const node = this.getExistingNode(id)
    const remainingAttributes = { ...node.attributes }
    delete remainingAttributes[`${attributeName}`]
    const n = { ...node, ...{ attributes: remainingAttributes } }
    return this.editNode(n)
  }

  addEdge(
    edge: Omit<ModelEdge, 'id' | 'attributes'> & {
      id?: string
      attributes?: ModelAttributeSet
    }
  ): ContentModel {
    // check source and target exist
    this.getExistingNode(edge.source)
    this.getExistingNode(edge.target)
    if (edge.id != null && this.containsEdge(edge.id)) {
      throw new Error(`Cannot add edge already in graph (${edge.id})`)
    }
    const newEdge: ModelEdge = {
      id: edge.id ?? v4(),
      attributes: edge.attributes ?? {},
      ...edge,
    }
    const edges = { ...this.edges, [newEdge.id]: newEdge }
    return new ContentModel(this.nodes, edges)
  }

  getEdge(id: string): ModelEdge | undefined {
    return this.edges[`${id}`]
  }

  private getExistingEdge(id: string): ModelEdge {
    const edge = this.getEdge(id)
    if (edge == null) {
      throw new Error(`Edge [${id}] does not exist`)
    }
    return edge
  }

  editEdge(edge: ModelEdge): ContentModel {
    // ensure edge exists
    this.getExistingEdge(edge.id)
    return new ContentModel(this.nodes, {
      ...this.edges,
      ...{ [edge.id]: edge },
    })
  }

  addEdgeAttribute<V>(
    id: string,
    attributeName: string,
    attributeValue: V
  ): ContentModel {
    const edge = this.getExistingEdge(id)
    const newAttributes = {
      ...edge.attributes,
      ...{ [attributeName]: attributeValue },
    }
    const changedEdge = {
      ...this.getExistingEdge(id),
      ...{ attributes: newAttributes },
    }
    return this.editEdge(changedEdge)
  }

  editEdgeAttribute<V>(
    id: string,
    attributeName: string,
    attributeValue: V
  ): ContentModel {
    if (this.getExistingEdge(id).attributes[`${attributeName}`] == null) {
      throw new Error(`Edge [${id}] does not have attribute ${attributeName}`)
    }
    return this.addEdgeAttribute(id, attributeName, attributeValue)
  }

  removeEdgeAttribute(id: string, attributeName: string): ContentModel {
    const edge = this.getExistingEdge(id)
    const remainingAttributes = { ...edge.attributes }
    delete remainingAttributes[`${attributeName}`]
    const e = { ...edge, ...{ attributes: remainingAttributes } }
    return this.editEdge(e)
  }

  removeEdge(id: string): ContentModel {
    const edge = this.getEdge(id)
    if (edge == null) {
      return this
    }
    const withoutEdge = { ...this.edges }
    delete withoutEdge[`${id}`]
    return new ContentModel(this.nodes, withoutEdge)
  }
}
