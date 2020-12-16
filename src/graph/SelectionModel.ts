export class SelectionModel {
  static createDefault(): SelectionModel {
    return new SelectionModel([], [])
  }

  readonly nodes: Set<string>
  readonly edges: Set<string>

  constructor(nodes: string[], edges: string[]) {
    this.nodes = new Set(nodes)
    this.edges = new Set(edges)
  }

  addNodes(nodeIds: string[]): SelectionModel {
    if (nodeIds.every((id) => this.nodes.has(id))) {
      return this
    }
    return new SelectionModel(
      [...Array.from(this.nodes), ...nodeIds],
      Array.from(this.edges)
    )
  }

  removeNodes(nodeIds: string[]): SelectionModel {
    if (nodeIds.every((id) => !this.nodes.has(id))) {
      return this
    }
    const remaining = new Set(Array.from(this.nodes))
    nodeIds.forEach((id) => remaining.delete(id))
    return new SelectionModel(Array.from(remaining), Array.from(this.edges))
  }

  addEdges(edgeIds: string[]): SelectionModel {
    if (edgeIds.every((id) => this.edges.has(id))) {
      return this
    }
    return new SelectionModel(Array.from(this.nodes), [
      ...Array.from(this.edges),
      ...edgeIds,
    ])
  }

  removeEdges(edgeIds: string[]): SelectionModel {
    if (edgeIds.every((id) => !this.edges.has(id))) {
      return this
    }
    const remaining = new Set(Array.from(this.edges))
    edgeIds.forEach((id) => remaining.delete(id))
    return new SelectionModel(Array.from(this.nodes), Array.from(remaining))
  }
}
