import { ContentModel } from 'graph'
import { Edge, EdgeDecorator, Item, Node, NodeDecorator } from '../types'

type Range = [min: number, max: number]

interface NumericMapping<T> {
  (item: T): [number | undefined, Range]
}

/**
 * Wraps a function from nodes to numbers to map it to the size of the node
 */
export const sizeNodeBy =
  (mapping: NumericMapping<Node>, range: Range = [10, 200]): NodeDecorator =>
  (node: Node) => ({ size: scale(...mapping(node), range) })

/**
 * Wraps a function from edges to numbers to map it to the size of the node
 */
export const sizeEdgeBy =
  (mapping: NumericMapping<Edge>, range: Range = [1, 5]): EdgeDecorator =>
  (edge: Edge) => ({ size: scale(...mapping(edge), range) })

const scale = (
  input: number | undefined,
  source: [min: number, max: number],
  target: [min: number, max: number]
): number | undefined => {
  if (input === undefined) {
    return undefined
  }

  const [sMin, sMax] = source
  const [tMin, tMax] = target

  const percent = (input - sMin) / (sMax - sMin)
  return percent * (tMax - tMin) + tMin
}

function getMinAndMax(items: Item[], key: string): [min: number, max: number] {
  const values = items
    .map((item) => parseFloat(item.metadata[key] as string))
    .filter((v) => !isNaN(v))
  const min = Math.min(...values)
  const max = Math.max(...values)
  return [min, max]
}

function metadata<T extends Item>(items: T[], id: string): NumericMapping<T> {
  const source = getMinAndMax(items, id)
  return (item: T) => {
    const value = parseFloat(item.metadata[id] as string)
    if (isNaN(value)) {
      return [undefined, source]
    } else {
      return [value, source]
    }
  }
}

/**
 *
 * Creates a decorator to size the nodes by a metadata value
 *
 * @param contentModel the current content model
 * @param key the key of the metadata
 * @param min optional minimum size
 * @param max optional minimum size
 * @returns node decorator
 */
export const sizeNodeByMetadata = (
  contentModel: ContentModel,
  key: string,
  range?: Range
): NodeDecorator =>
  sizeNodeBy(metadata(Object.values(contentModel.nodes), key), range)

/**
 *
 * Creates a decorator to size the edges by a metadata value
 *
 * @param contentModel the current content model
 * @param key the key of the metadata
 * @param min optional minimum size
 * @param max optional minimum size
 * @returns edge decorator
 */
export const sizeEdgeByMetadata = (
  contentModel: ContentModel,
  key: string,
  range?: Range
): EdgeDecorator =>
  sizeEdgeBy(metadata(Object.values(contentModel.edges), key), range)
