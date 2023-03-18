import { v4 } from 'uuid'
import {
  Edge,
  Item,
  MetadataTypes,
  ModelEdge,
  ModelGraphData,
  ModelNode,
  Node,
} from './types'

export class ContentModel {
  private static toNode(modelNode: ModelNode): Node {
    return { id: modelNode.id ?? v4(), metadata: {}, ...modelNode }
  }

  public static toEdge(modelEdge: ModelEdge): Edge {
    return {
      id: modelEdge.id ?? v4(),
      directed: true,
      metadata: {},
      ...modelEdge,
    }
  }

  public static fromRaw(data: ModelGraphData): ContentModel {
    const nodes = Object.keys(data.nodes).reduce<Record<string, Node>>(
      (obj, id) => {
        const node = ContentModel.toNode({ ...data.nodes[id], id })
        obj[node.id] = node
        return obj
      },
      {}
    )
    const edges = data.edges.reduce<Record<string, Edge>>((obj, modelEdge) => {
      const edge = ContentModel.toEdge(modelEdge)
      obj[edge.id] = edge
      return obj
    }, {})
    const model = new ContentModel(nodes, edges)
    model.validate()
    return model
  }

  public static createEmpty(): ContentModel {
    return new ContentModel({}, {})
  }

  constructor(
    readonly nodes: Record<string, Node>,
    readonly edges: Record<string, Edge>
  ) {}

  validate() {
    Object.values(this.edges).forEach((e) => this.checkEdgeNodes(e))
  }

  containsNode(id: string): boolean {
    return this.getNode(id) != null
  }

  containsEdge(id: string): boolean {
    return this.getEdge(id) != null
  }

  getNode(id: string): Node | undefined {
    return this.nodes[`${id}`]
  }

  private getExistingNode(id: string | undefined): Node {
    if (id == null) {
      throw new Error(`Node id must be given`)
    }
    const node = this.getNode(id)
    if (node == null) {
      throw new Error(`Node [${id}] does not exist`)
    }
    return node
  }

  getEdgesLinkedToNode(nodeId: string): Edge[] {
    return Object.values(this.edges).filter(
      (e) => e.target === nodeId || e.source === nodeId
    )
  }

  addNode(modelNode: ModelNode): ContentModel {
    if (modelNode.id != null && this.containsNode(modelNode.id)) {
      throw new Error(`Cannot add node already in graph (${modelNode.id})`)
    }
    const node = ContentModel.toNode(modelNode)
    const nodes = { ...this.nodes, [node.id]: node }
    return new ContentModel(nodes, this.edges)
  }

  editNode(node: ModelNode): ContentModel {
    const existing = this.getExistingNode(node.id)
    return new ContentModel(
      { ...this.nodes, [existing.id]: ContentModel.toNode(node) },
      this.edges
    )
  }

  /**
   * @deprecated use addNodeMetadata
   */
  addNodeAttribute<V>(
    id: string,
    attributeName: string,
    attributeValue: V
  ): ContentModel {
    return this.addNodeMetadata<V>(id, attributeName, attributeValue)
  }

  addNodeMetadata<V>(id: string, key: string, value: V): ContentModel {
    const node = this.getExistingNode(id)
    const newMetadata = {
      ...node.metadata,
      ...{ [key]: value },
    }
    const changedNode = {
      ...node,
      metadata: newMetadata,
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

  /**
   * @deprecated use editNodeMetadata
   */
  editNodeAttribute<V>(
    id: string,
    attributeName: string,
    attributeValue: V
  ): ContentModel {
    return this.editNodeMetadata(id, attributeName, attributeValue)
  }

  editNodeMetadata<V>(id: string, key: string, value: V): ContentModel {
    if (this.getExistingNode(id).metadata[`${key}`] == null) {
      throw new Error(`Node [${id}] does not have metadata ${key}`)
    }
    return this.addNodeMetadata(id, key, value)
  }

  /**
   * @deprecated use removeNodeMetadata
   */
  removeNodeAttribute(id: string, attributeName: string): ContentModel {
    return this.removeNodeMetadata(id, attributeName)
  }

  removeNodeMetadata(id: string, key: string): ContentModel {
    const node = this.getExistingNode(id)
    const remainingMetadata = { ...node.metadata }
    delete remainingMetadata[`${key}`]
    const n = { ...node, metadata: remainingMetadata }
    return this.editNode(n)
  }

  addEdge(modelEdge: ModelEdge): ContentModel {
    this.checkEdgeNodes(modelEdge)
    if (modelEdge.id != null && this.containsEdge(modelEdge.id)) {
      throw new Error(`Cannot add edge already in graph (${modelEdge.id})`)
    }
    const newEdge = ContentModel.toEdge(modelEdge)
    const edges = { ...this.edges, [newEdge.id]: newEdge }
    return new ContentModel(this.nodes, edges)
  }

  checkEdgeNodes(edge: ModelEdge): void {
    this.getExistingNode(edge.source)
    this.getExistingNode(edge.target)
  }

  getEdge(id: string): Edge | undefined {
    return this.edges[`${id}`]
  }

  private getExistingEdge(id: string | undefined): Edge {
    if (id == null) {
      throw new Error('Edge id must be provided')
    }
    const edge = this.getEdge(id)
    if (edge == null) {
      throw new Error(`Edge [${id}] does not exist`)
    }
    return edge
  }

  editEdge(edge: ModelEdge): ContentModel {
    // ensure edge exists
    const existing = this.getExistingEdge(edge.id)
    return new ContentModel(this.nodes, {
      ...this.edges,
      [existing.id]: ContentModel.toEdge(edge),
    })
  }

  /**
   * @deprecated use addEdgeMetadata
   */
  addEdgeAttribute<V>(
    id: string,
    attributeName: string,
    attributeValue: V
  ): ContentModel {
    return this.addEdgeMetadata(id, attributeName, attributeValue)
  }

  addEdgeMetadata<V>(id: string, key: string, value: V): ContentModel {
    const edge = this.getExistingEdge(id)
    const newMetadata = {
      ...edge.metadata,
      [key]: value,
    }
    const changedEdge = {
      ...this.getExistingEdge(id),
      metadata: newMetadata,
    }
    return this.editEdge(changedEdge)
  }

  /**
   * @deprecated use editEdgeMetadata
   */
  editEdgeAttribute<V>(
    id: string,
    attributeName: string,
    attributeValue: V
  ): ContentModel {
    return this.editEdgeMetadata(id, attributeName, attributeValue)
  }

  editEdgeMetadata<V>(id: string, key: string, value: V): ContentModel {
    if (this.getExistingEdge(id).metadata[`${key}`] == null) {
      throw new Error(`Edge [${id}] does not have attribute ${key}`)
    }
    return this.addEdgeMetadata(id, key, value)
  }

  /**
   * @deprecated use removeEdgeMetadata
   */
  removeEdgeAttribute(id: string, attributeName: string): ContentModel {
    return this.removeEdgeMetadata(id, attributeName)
  }

  removeEdgeMetadata(id: string, attributeName: string): ContentModel {
    const edge = this.getExistingEdge(id)
    const remainingMetadata = { ...edge.metadata }
    delete remainingMetadata[`${attributeName}`]
    const e = { ...edge, metadata: remainingMetadata }
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

  private getMetadataSets(items: Item[]): MetadataTypes {
    return items.reduce<MetadataTypes>((metadataSets, item) => {
      Object.entries(item.metadata).forEach((a) => {
        const metadataKey = metadataSets[a[0]] ?? new Set<string>()
        metadataKey.add(typeof a[1])
        metadataSets[a[0]] = metadataKey
      })
      return metadataSets
    }, {})
  }

  /**
   * @deprecated use getNodeMetadataSets
   */
  getNodeAttributes(): MetadataTypes {
    return this.getNodeMetadataTypes()
  }

  getNodeMetadataTypes(): MetadataTypes {
    return this.getMetadataSets(Object.values(this.nodes))
  }

  /**
   * @deprecated use getEdgeMetadataSets
   */
  getEdgeAttributes(): MetadataTypes {
    return this.getEdgeMetadataTypes()
  }

  getEdgeMetadataTypes(): MetadataTypes {
    return this.getMetadataSets(Object.values(this.edges))
  }
}
