import { Edge, Metadata, Node } from '@committed/graph'
import { fragmentId } from './labels'

/**
 *
 * @param item Opinionated function to process rdf nodes and edges for a cleaner presentation in the graph
 * @returns
 */
export const cleanProcessor = <T extends Node | Edge>(item: T): T => {
  if (typeof item.label === 'string' && item.id.includes(`|${item.label}|`)) {
    item.label = fragmentId(item.label)
  }

  if (item.label === undefined || item.label === item.id) {
    item.label = fragmentId(item.id)
  }

  if (typeof item.metadata.type === 'string') {
    item.metadata.type = fragmentId(item.metadata.type)
  }

  const metadata: Metadata = {}
  Object.keys(item.metadata).forEach((key) => {
    metadata[fragmentId(key)] = item.metadata[key]
  })
  item.metadata = metadata

  return item
}
