import { ModelItem } from '@committed/graph'

const labelNodeBy =
  <T extends ModelItem>(mapping: (item: T) => string) =>
  (item: T) => ({ label: mapping(item) })

const idTo = (mapping: (id: string) => string) => (item: ModelItem) =>
  mapping(item.id)

export const prefixedId =
  (prefixes: Record<string, string>) =>
  (id: string): string => {
    const match = Object.keys(prefixes).find((prefix) => id.startsWith(prefix))
    if (match !== undefined) {
      const prefix = prefixes[match]
      return `${prefix}:${id.substring(match.length)}`
    }
    return id
  }

export const fragmentId = (id: string): string => {
  try {
    const url = new URL(id)
    const hash = url.hash
    if (hash) {
      return hash.substring(1)
    }
    const path = url.pathname
    return path.substring(path.lastIndexOf('/') + 1)
  } catch (e) {
    return id
  }
}

/**
 *
 * Creates a decorator to map ids to labels with RDF style prefixes using the provided prefixes.
 *
 * @param prefixes map of prefix to full URI
 * @returns item decorator
 */
export const labelWithPrefix = <T extends ModelItem>(
  prefixes: Record<string, string>
): ((item: T) => { label: string }) =>
  labelNodeBy<T>(idTo(prefixedId(prefixes)))

/**
 *
 * Creates a decorator to map ids to labels using the fragment of the URL or last path part
 *
 * @returns item decorator
 */
export const labelWithFragment = <T extends ModelItem>(): ((item: T) => {
  label: string
}) => labelNodeBy<T>(idTo(fragmentId))
