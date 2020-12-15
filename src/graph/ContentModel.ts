import {
  ModelNode,
  ModelEdge,
  ModelGraphData,
  ModelAttributeSet,
} from './types'
import { v4 } from 'uuid'

export class ContentModel {
  public static fromRaw(data: ModelGraphData): ContentModel {
    // can be more lenient here
    return new ContentModel(data.nodes, data.edges)
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
    return this.nodes[id] != null
  }

  containsEdge(id: string): boolean {
    return this.edges[id] != null
  }

  getNode(id: string): ModelNode {
    if (!this.containsNode(id)) {
      throw new Error(`Node [${id}] does not exist`)
    }
    return this.nodes[id]
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
    // ensure node exists
    this.getNode(node.id)
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
    const node = this.getNode(id)
    const newAttributes = {
      ...node.attributes,
      ...{ [attributeName]: attributeValue },
    }
    const changedNode = {
      ...this.getNode(id),
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
    const node = this.getNode(id)
    if (node == null) {
      return this
    }
    const { [id]: _, ...withoutNode } = this.nodes
    return new ContentModel(withoutNode, this.edges)
  }

  editNodeAttribute<V>(
    id: string,
    attributeName: string,
    attributeValue: V
  ): ContentModel {
    if (this.getNode(id).attributes[attributeName] == null) {
      throw new Error(`Node [${id}] does not have attribute ${attributeName}`)
    }
    return this.addNodeAttribute(id, attributeName, attributeValue)
  }

  removeNodeAttribute(id: string, attributeName: string): ContentModel {
    const node = this.getNode(id)
    const { [attributeName]: _, ...remainingAttributes } = node.attributes
    const n = { ...node, ...{ attributes: remainingAttributes } }
    return this.editNode(n)
  }

  addEdge(
    edge: Omit<ModelEdge, 'id' | 'attributes'> & {
      id?: string
      attributes?: ModelAttributeSet
    }
  ): ContentModel {
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

  getEdge(id: string): ModelEdge {
    if (!this.containsEdge(id)) {
      throw new Error(`Edge [${id}] does not exist`)
    }
    return this.edges[id]
  }

  editEdge(edge: ModelEdge): ContentModel {
    // ensure edge exists
    this.getEdge(edge.id)
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
    const edge = this.getEdge(id)
    const newAttributes = {
      ...edge.attributes,
      ...{ [attributeName]: attributeValue },
    }
    const changedEdge = {
      ...this.getEdge(id),
      ...{ attributes: newAttributes },
    }
    return this.editEdge(changedEdge)
  }

  editEdgeAttribute<V>(
    id: string,
    attributeName: string,
    attributeValue: V
  ): ContentModel {
    if (this.getEdge(id).attributes[attributeName] == null) {
      throw new Error(`Edge [${id}] does not have attribute ${attributeName}`)
    }
    return this.addEdgeAttribute(id, attributeName, attributeValue)
  }

  removeEdgeAttribute(id: string, attributeName: string): ContentModel {
    const edge = this.getEdge(id)
    const { [attributeName]: _, ...remainingAttributes } = edge.attributes
    const e = { ...edge, ...{ attributes: remainingAttributes } }
    return this.editEdge(e)
  }

  removeEdge(id: string): ContentModel {
    const edge = this.getEdge(id)
    if (edge == null) {
      return this
    }
    const { [id]: _, ...withoutEdge } = this.edges
    return new ContentModel(this.nodes, withoutEdge)
  }
}
