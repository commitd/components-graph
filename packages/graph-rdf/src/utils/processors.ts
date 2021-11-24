import { ModelAttributeSet, ModelEdge, ModelNode } from '@committed/graph'
import { fragmentId } from './labels'

/**
 *
 * @param item Opinionated function to process rdf nodes and edges for a cleaner presentation in the graph
 * @returns
 */
export const cleanProcessor = <T extends ModelNode | ModelEdge>(item: T): T => {
  if (typeof item.label === 'string' && item.id.includes(`|${item.label}|`)) {
    item.label = fragmentId(item.label)
  }

  if (item.label === undefined || item.label === item.id) {
    item.label = fragmentId(item.id)
  }

  if (typeof item.attributes.type === 'string') {
    item.attributes.type = fragmentId(item.attributes.type)
  }

  const attributes: ModelAttributeSet = {}
  Object.keys(item.attributes).forEach((key) => {
    attributes[fragmentId(key)] = item.attributes[key]
  })
  item.attributes = attributes

  return item
}
