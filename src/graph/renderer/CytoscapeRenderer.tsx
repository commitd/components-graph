import { useTheme } from '@committed/components'
import {
  Css,
  EdgeCollection,
  EdgeDataDefinition,
  EdgeSingular,
  ElementDefinition,
  LayoutOptions,
  NodeCollection,
  NodeDataDefinition,
  Stylesheet,
  use,
  EventObject,
} from 'cytoscape'
//@ts-ignore
import ccola from 'cytoscape-cola'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
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
} from '../types'
import {
  CustomLayoutOptions,
  CytoscapeGraphLayoutAdapter,
} from './CytoscapeGraphLayoutAdapter'
import cy from 'cytoscape'
import dblclick from 'cytoscape-dblclick'
import { useCyListener } from './useCyListener'

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

use(CytoscapeGraphLayoutAdapter.register)
use(ccola)

let firstRun = true

const toNodeCyStyle = (d: Partial<NodeDecoration>): Css.Node | undefined => {
  const s = {
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
    label: e.label,
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
  if (firstRun) {
    cy.use(dblclick)
    firstRun = false
  }
  const layouts: Record<GraphLayout, LayoutOptions> = {
    'force-directed': forceDirected,
    circle,
    grid,
    cola,
    custom: {
      name: CytoscapeGraphLayoutAdapter.LAYOUT_NAME,
      model: graphModel,
      algorithm: graphModel.getCurrentLayout().getLayoutAlgorithm(),
    } as CustomLayoutOptions & LayoutOptions,
  }
  const nodes = graphModel.nodes
  const edges = graphModel.edges
  const selection = graphModel.getSelection()
  const [cytoscape, setCytoscape] = useState<cytoscape.Core>()
  const layoutStart = useRef<number>()
  const theme = useTheme()
  const dirty = graphModel.getCurrentLayout().isDirty()
  const layout = graphModel.getCurrentLayout().getLayout()

  // prevent rapid selection updates from fighting each other
  // and improve performance overheads by debouncing selection updates

  const triggerLayout = useDebouncedCallback((graphLayout: GraphLayout) => {
    if (cytoscape != null) {
      const l = layouts[`${graphLayout}` as GraphLayout]
      if (l == null) {
        throw new Error('Layout does not exist')
      }
      cytoscape.layout(l).run()
    }
  }, 200)

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
      selectionUpdate.callback()
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
    triggerLayout.callback(layout)
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
  useCyListener(cytoscape, updateLayout, 'add remove', 'edge')
  useCyListener(cytoscape, updateLayout, 'resize', 'edge')
  useCyListener(cytoscape, selectNode, 'select', 'node')
  useCyListener(cytoscape, unselectNode, 'unselect', 'node')
  useCyListener(cytoscape, selectEdge, 'select', 'edge')
  useCyListener(cytoscape, unselectEdge, 'unselect', 'edge')
  useCyListener(cytoscape, layoutStarting, 'layoutstart')
  useCyListener(cytoscape, layoutStopping, 'layoutstop')
  useEffect(() => {
    if (cytoscape != null) cytoscape.dblclick()
  }, [cytoscape])
  useCyListener(cytoscape, dblclickNode, 'dblclick', 'node')

  useEffect(() => {
    if (dirty) {
      triggerLayout.callback(layout)
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
          triggerLayout.callback(layout)
          break
        case 'Refit':
          cytoscape.fit()
          break
        default:
          console.warn('Unsupported command')
      }
    })
    onChange(graphModel.clearCommands())
    // TODO check for correct dependecy list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commands])

  const elements = useMemo(
    () => [
      ...nodes.map((n) => {
        const node: NodeDataDefinition = {
          id: n.id,
          label: n.label,
          model: n,
        }
        const element: ElementDefinition = {
          data: node,
          style: toNodeCyStyle(n.getDecorationOverrides(theme)),
          selected: selection.nodes.has(n.id),
        }
        return element
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
        const { label, ...style } =
          toEdgeCyStyle(e.getDecorationOverrides(theme)) ?? {}
        const element: ElementDefinition = {
          data: { ...edge, label },
          style,
          classes: 'bezier',
        }
        return element
      }),
    ],
    [nodes, edges, selection, theme]
  )

  const defaultNodeStyles: Stylesheet = useMemo(() => {
    const nodeDefaults = graphModel.getDecorators().getDefaultNodeDecorator()(
      theme
    )
    return {
      selector: 'node',
      style: {
        label: 'data(label)',
        // label styles
        'text-background-color': theme.palette.background.paper,
        color: theme.palette.text.primary,
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
      },
    }
  }, [graphModel, theme])

  const defaultEdgeStyles: Stylesheet = useMemo(() => {
    const edgeDefaults = graphModel.getDecorators().getDefaultEdgeDecorator()(
      theme
    )
    return {
      selector: 'edge',
      style: {
        label: 'data(label)',
        // label styles
        'text-background-color': theme.palette.background.paper,
        color: theme.palette.text.primary,
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
        'line-color': edgeDefaults.color,
        'target-arrow-color': edgeDefaults.color,
        opacity: edgeDefaults.opacity,
      },
    }
  }, [graphModel, theme])
  return (
    <CytoscapeComponent
      elements={elements}
      style={{
        width:
          options.width == null || options.width === 'full-width'
            ? '100%'
            : options.width,
        height: options.height === 'full-height' ? '100%' : options.height,
        backgroundColor: theme.palette.background.paper,
        overflow: 'hidden',
      }}
      cy={(cy): void => {
        setCytoscape(cy)
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
