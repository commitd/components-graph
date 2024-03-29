export * from '@committed/graph'
export * from '@committed/components-graph-react'

import { Json } from '@committed/graph-json'
import { Rdf } from '@committed/graph-rdf'

export { Json, Rdf }

export const GraphBuilder = {
  fromJsonGraph: Json.buildGraph,
  fromRdfGraph: Rdf.buildGraph,
}
