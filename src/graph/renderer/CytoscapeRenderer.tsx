/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useTheme } from '@committed/components'
import {
  Css,
  EdgeCollection,
  EdgeDataDefinition,
  EdgeSingular,
  EventObject,
  LayoutOptions,
  NodeCollection,
  NodeDataDefinition,
  Stylesheet,
  use,
} from 'cytoscape'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import ccola from 'cytoscape-cola'
import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import tinycolor from 'tinycolor2'
import { useDebouncedCallback } from 'use-debounce'
import { GraphModel } from '../GraphModel'
import { circle } from '../layouts/Circle'
import { cola } from '../layouts/Cola'
import { forceDirected } from '../layouts/ForceDirected'
import { grid } from '../layouts/Grid'
import { SelectionModel } from '../SelectionModel'
import {
  EdgeDecoration,
  GraphLayout,
  GraphRenderer,
  GraphRendererOptions,
  NodeDecoration,
  PresetGraphLayout,
} from '../types'
import {
  CustomLayoutOptions,
  CytoscapeGraphLayoutAdapter,
} from './CytoscapeGraphLayoutAdapter'
import { useCyListener } from './useCyListener'

/**
 * Call to initialize the additional modules.
 */
/*
 * This is a work-around - the modules do not seem to be registered when using as a library so must be called by the lib user.
 * Should be able to remove but may be a bundling issue.
 */
export function initializeCytoscape(
  cyuse: (module: cytoscape.Ext) => void
): void {
  try {
    cyuse(CytoscapeGraphLayoutAdapter.register)
    cyuse(ccola)
  } catch {
    // Ignore multiple attempts to initialize
  }
}

initializeCytoscape(use)

export interface CyGraphRendererOptions extends GraphRendererOptions {
  renderOptions: Pick<
    React.ComponentProps<typeof CytoscapeComponent>,
    | 'zoom'
    | 'minZoom'
    | 'maxZoom'
    | 'pan'
    | 'zoomingEnabled'
    | 'userZoomingEnabled'
    | 'boxSelectionEnabled'
    | 'autoungrabify'
    | 'autounselectify'
    | 'wheelSensitivity'
  >
}

const dblClick = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let clicked: any | null = null
  return (evt: EventObject) => {
    if (clicked && clicked === evt.target) {
      clicked = null
      evt.preventDefault()
      evt.stopPropagation()
      evt.target.emit('dblclick', [evt])
    } else {
      clicked = evt.target
      setTimeout(() => {
        if (clicked && clicked === evt.target) {
          clicked = null
          evt.target.emit('dblclick:timeout', [evt])
        }
      }, 500)
    }
  }
}

const toNodeCyStyle = (d: Partial<NodeDecoration>): Css.Node | undefined => {
  const s: Css.Node = {
    backgroundColor: d.color,
    width: d.size,
    height: d.size,
    shape: d.shape,
    'background-image': d.icon,
    'background-opacity': d.opacity,
    'background-image-opacity': d.opacity,
    'border-opacity': d.opacity,
    'border-color': d.strokeColor,
  }
  if (d.label !== undefined) {
    s.label = d.label
  }
  if (Object.values(s).every((v) => v == null)) {
    return undefined
  } else {
    return s
  }
}

const toEdgeCyStyle = (e: Partial<EdgeDecoration>): Css.Edge | undefined => {
  const s: Css.Edge = {
    'line-color': e.color,
    'target-arrow-color': e.color,
    opacity: e.opacity,
  }

  if (e.label !== undefined) {
    s.label = e.label
  }
  if (Object.values(s).every((v) => v == null)) {
    return undefined
  } else {
    return s
  }
}

const Renderer: GraphRenderer<CyGraphRendererOptions>['render'] = ({
  graphModel,
  onChange,
  onViewNode,
  options,
}) => {
  const layouts: Record<PresetGraphLayout | 'custom', LayoutOptions> = {
    'force-directed': forceDirected,
    circle,
    grid,
    cola,
    custom: {
      name: CytoscapeGraphLayoutAdapter.LAYOUT_NAME,
      model: graphModel,
      algorithm: graphModel.getCurrentLayout().getLayout(),
    } as CustomLayoutOptions & LayoutOptions,
  }
  const nodes = graphModel.nodes
  const edges = graphModel.edges
  const selection = graphModel.getSelection()
  const [cytoscape, setCytoscape] = useState<cytoscape.Core>()
  const layoutStart = useRef<number>()
  const [theme, resolveThemeToken] = useTheme()
  const dirty = graphModel.getCurrentLayout().isDirty()
  const layout = graphModel.getCurrentLayout().getLayout()

  // prevent rapid selection updates from fighting each other
  // and improve performance overheads by debouncing selection updates

  const triggerLayout: (layout: GraphLayout) => void = useDebouncedCallback(
    (graphLayout: GraphLayout) => {
      if (cytoscape != null) {
        const l =
          typeof graphLayout === 'string'
            ? layouts[graphLayout]
            : ({
                name: CytoscapeGraphLayoutAdapter.LAYOUT_NAME,
                model: graphModel,
                algorithm: graphLayout,
              } as CustomLayoutOptions)
        if (l == null) {
          throw new Error('Layout does not exist')
        }
        cytoscape.layout(l as LayoutOptions).run()
      }
    },
    200
  )

  const pendingSelection = useRef<SelectionModel>(selection)

  useEffect(() => {
    pendingSelection.current = selection
  }, [selection])
  const selectionUpdate = useDebouncedCallback(() => {
    if (pendingSelection.current != null) {
      onChange(GraphModel.applySelection(graphModel, pendingSelection.current))
    }
  }, 100)

  const updateSelection = useCallback(
    (updater: (s: SelectionModel) => SelectionModel) => {
      pendingSelection.current = updater(pendingSelection.current)
      selectionUpdate()
    },
    [pendingSelection, selectionUpdate]
  )
  const handleViewNode = useCallback(
    (id: string) => {
      const node = graphModel.getNode(id)
      if (node != null && onViewNode != null) {
        onViewNode(node)
      }
    },
    [onViewNode, graphModel]
  )

  const updateLayout = useCallback(() => {
    triggerLayout(layout)
  }, [triggerLayout, layout])
  const selectNode = useCallback(
    (e: EventObject) => {
      const selectedNodes = e.target as NodeCollection
      updateSelection((s) => s.addNodes(selectedNodes.map((n) => n.id())))
    },
    [updateSelection]
  )
  const unselectNode = useCallback(
    (e: EventObject) => {
      const selectedNodes = e.target as NodeCollection
      updateSelection((s) => s.removeNodes(selectedNodes.map((n) => n.id())))
    },
    [updateSelection]
  )
  const selectEdge = useCallback(
    (e: EventObject) => {
      const selectedEdges = e.target as EdgeCollection
      updateSelection((s) => s.addEdges(selectedEdges.map((n) => n.id())))
    },
    [updateSelection]
  )
  const unselectEdge = useCallback(
    (e: EventObject) => {
      const selectedEdges = e.target as EdgeCollection
      updateSelection((s) => s.removeEdges(selectedEdges.map((n) => n.id())))
    },
    [updateSelection]
  )
  const layoutStarting = useCallback(() => {
    console.debug('Layout started')
    layoutStart.current = Date.now()
  }, [])
  const layoutStopping = useCallback(() => {
    if (layoutStart.current != null) {
      console.debug(`Layout took ${Date.now() - layoutStart.current}ms`)
    }
  }, [])

  useCyListener(cytoscape, updateLayout, 'add remove', 'edge')
  useCyListener(cytoscape, updateLayout, 'resize', 'edge')
  useCyListener(cytoscape, selectNode, 'select', 'node')
  useCyListener(cytoscape, unselectNode, 'unselect', 'node')
  useCyListener(cytoscape, selectEdge, 'select', 'edge')
  useCyListener(cytoscape, unselectEdge, 'unselect', 'edge')
  useCyListener(cytoscape, layoutStarting, 'layoutstart')
  useCyListener(cytoscape, layoutStopping, 'layoutstop')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dblClickCallback = useCallback(dblClick(), [])

  const dblclickNode = useCallback(
    (e: EventObject) => {
      const selectedNodes = e.target as NodeCollection
      const node = selectedNodes[0]
      if (node != null) {
        handleViewNode(node.id())
      }
    },
    [handleViewNode]
  )
  useCyListener(cytoscape, dblClickCallback, 'click', 'node')
  useCyListener(cytoscape, dblclickNode, 'dblclick', 'node')

  useEffect(() => {
    if (dirty) {
      triggerLayout(layout)
      onChange(
        GraphModel.applyLayout(
          graphModel,
          graphModel.getCurrentLayout().validate()
        )
      )
    }
  }, [dirty, layout, onChange, graphModel, triggerLayout])

  const commands = graphModel.getCommands()
  useEffect(() => {
    if (cytoscape == null) {
      return
    }
    const zoomAmount = 1 + (options.renderOptions.wheelSensitivity ?? 1)
    const position = { x: cytoscape.width() / 2, y: cytoscape.height() / 2 }
    commands.forEach((c) => {
      switch (c.type) {
        case 'ZoomIn':
          cytoscape.zoom({
            level: cytoscape.zoom() * zoomAmount,
            position,
          })
          break
        case 'ZoomOut':
          cytoscape.zoom({
            level: cytoscape.zoom() / zoomAmount,
            position,
          })
          break
        case 'Layout':
          triggerLayout(layout)
          break
        case 'Refit':
          cytoscape.fit()
          break
        default:
          console.warn('Unsupported command')
      }
    })
    onChange(graphModel.clearCommands())
    // TODO check for correct dependency list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commands])

  const resolveThemeValue = useCallback(
    <T extends string | number>(val: T): T => {
      if (val === undefined) {
        return val
      }

      if (typeof val === 'string') {
        const resolved = resolveThemeToken(val)
        if (resolved.startsWith('hsl')) {
          return `#${tinycolor(resolved).toHex()}` as T
        } else {
          return resolved as T
        }
      }
      return val
    },
    [resolveThemeToken]
  )

  const resolveThemedObject = useCallback(
    // eslint-disable-next-line @typescript-eslint/ban-types
    <T extends object>(obj: T): T => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return Object.keys(obj).reduce(function (result, key) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
        if (obj[key] !== undefined) result[key] = resolveThemeValue(obj[key])
        return result
      }, {} as T)
    },
    [resolveThemeValue]
  )

  const elements = useMemo(
    () => [
      ...nodes.map((n) => {
        const node: NodeDataDefinition = {
          id: n.id,
          label: n.label,
          model: n,
        }
        const { label, ...style } = resolveThemedObject(
          toNodeCyStyle(n.getDecorationOverrides()) ?? {}
        )
        return {
          data: { ...node, label },
          style,
          selected: selection.nodes.has(n.id),
        }
      }),
      ...edges.map((e) => {
        const edge: EdgeDataDefinition = {
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.label,
          selected: selection.edges.has(e.id),
          model: e,
        }
        const { label, ...style } = resolveThemedObject(
          toEdgeCyStyle(e.getDecorationOverrides()) ?? {}
        )
        return {
          data: { ...edge, label },
          style,
          classes: 'bezier',
        }
      }),
    ],
    [nodes, edges, resolveThemedObject, selection.nodes, selection.edges]
  )

  const defaultNodeStyles: Stylesheet = useMemo(() => {
    const nodeDefaults = graphModel.getDecorators().getDefaultNodeDecorator()()
    return {
      selector: 'node',
      style: resolveThemedObject({
        label: 'data(label)',
        // label styles
        'text-background-color': '$colors$paper',
        color: '$colors$text',
        'text-background-opacity': 0.7,
        'text-margin-y': -4,
        'text-background-shape': 'roundrectangle',

        // icon styles
        'background-width': '100%',
        'background-height': '100%',
        'border-width': (e) => {
          const strokeSize = graphModel.getNode(e.id())?.strokeSize
          return strokeSize == null
            ? nodeDefaults.strokeSize
            : e.selected()
            ? strokeSize * 3
            : strokeSize
        },
        ...toNodeCyStyle(nodeDefaults),
      }),
    }
  }, [graphModel, resolveThemedObject])

  const defaultEdgeStyles: Stylesheet = useMemo(() => {
    const edgeDefaults = graphModel.getDecorators().getDefaultEdgeDecorator()()
    return {
      selector: 'edge',
      style: resolveThemedObject({
        label: 'data(label)',
        // label styles
        'text-background-color': '$colors$paper',
        color: '$colors$text',
        'text-background-opacity': 0.7,
        'text-margin-y': -4,
        'text-background-shape': 'roundrectangle',
        'target-arrow-shape': 'triangle',
        'target-endpoint': 'outside-to-node-or-label',
        width: (e: EdgeSingular) => {
          const size = graphModel.getEdge(e.id())?.size
          return size == null
            ? edgeDefaults.size
            : e.selected()
            ? size * 3
            : size
        },
        ...toEdgeCyStyle(edgeDefaults),
      }),
    }
  }, [graphModel, resolveThemedObject])

  if (theme === undefined) {
    // Wait for theme to be defined
    return null
  }

  return (
    <CytoscapeComponent
      elements={elements}
      style={{
        width:
          options.width == null || options.width === 'full-width'
            ? '100%'
            : options.width,
        height: options.height === 'full-height' ? '100%' : options.height,
        backgroundColor: resolveThemeValue(
          '$colors$paper'
        ) as CSSProperties['backgroundColor'],
        overflow: 'hidden',
      }}
      cy={(cyCore): void => {
        setCytoscape(cyCore)
      }}
      stylesheet={[defaultNodeStyles, defaultEdgeStyles]}
      {...options.renderOptions}
    />
  )
}

export const cytoscapeRenderer: GraphRenderer<CyGraphRendererOptions> = {
  render: Renderer,
  defaultOptions: {
    height: 300,
    renderOptions: {
      maxZoom: 5,
      minZoom: 0.05,
    },
  },
  layouts: ['circle', 'cola', 'force-directed', 'grid'],
}
