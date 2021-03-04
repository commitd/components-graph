import { Core, EventObject } from 'cytoscape'
import { useEffect } from 'react'

export function useCyListener(
  cytoscape: Core | undefined,
  func: (event: EventObject, extraParams?: unknown) => void,
  events: string,
  selector?: string
): void {
  useEffect(() => {
    if (cytoscape == null) {
      return
    }
    const callback = (event: EventObject, extraParams?: unknown): void =>
      func(event, extraParams)
    if (selector == null) {
      cytoscape.addListener(events, callback)
    } else {
      cytoscape.addListener(events, selector, callback)
    }
    return () => {
      if (selector == null) {
        cytoscape.removeListener(events, callback)
      } else {
        cytoscape.removeListener(events, selector, callback)
      }
    }
  }, [cytoscape, func, events, selector])
}
