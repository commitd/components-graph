import { ContentModel } from 'graph'
import {
  EdgeDecorator,
  ModelEdge,
  ModelItem,
  ModelNode,
  NodeDecorator,
} from '../types'

type Range = [min: number, max: number]

interface NumericMapping<T> {
  (item: T): [number | undefined, Range]
}

/**
 * Wraps a function from nodes to numbers to map it to the size of the node
 */
export const sizeNodeBy =
  (
    mapping: NumericMapping<ModelNode>,
    range: Range = [10, 200]
  ): NodeDecorator =>
  (node: ModelNode) => ({ size: scale(...mapping(node), range) })

/**
 * Wraps a function from edges to numbers to map it to the size of the node
 */
export const sizeEdgeBy =
  (mapping: NumericMapping<ModelEdge>, range: Range = [1, 5]): EdgeDecorator =>
  (edge: ModelEdge) => ({ size: scale(...mapping(edge), range) })

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

function getMinAndMax(
  items: ModelItem[],
  attributeKey: string
): [min: number, max: number] {
  const values = items
    .map((item) => parseFloat(item.attributes[attributeKey] as string))
    .filter((v) => !isNaN(v))
  const min = Math.min(...values)
  const max = Math.max(...values)
  return [min, max]
}

function attribute<T extends ModelItem>(
  items: T[],
  id: string
): NumericMapping<T> {
  const source = getMinAndMax(items, id)
  return (item: T) => {
    const value = parseFloat(item.attributes[id] as string)
    if (isNaN(value)) {
      return [undefined, source]
    } else {
      return [value, source]
    }
  }
}

/**
 *
 * Creates a decorator to size the nodes by an attribute value
 *
 * @param contentModel the current content model
 * @param attributeId the id of the attribute
 * @param min optional minimum size
 * @param max optional minimum size
 * @returns node decorator
 */
export const sizeNodeByAttribute = (
  contentModel: ContentModel,
  attributeId: string,
  range?: Range
): NodeDecorator =>
  sizeNodeBy(attribute(Object.values(contentModel.nodes), attributeId), range)

/**
 *
 * Creates a decorator to size the edges by an attribute value
 *
 * @param contentModel the current content model
 * @param attributeId the id of the attribute
 * @param min optional minimum size
 * @param max optional minimum size
 * @returns edge decorator
 */
export const sizeEdgeByAttribute = (
  contentModel: ContentModel,
  attributeId: string,
  range?: Range
): EdgeDecorator =>
  sizeEdgeBy(attribute(Object.values(contentModel.edges), attributeId), range)
