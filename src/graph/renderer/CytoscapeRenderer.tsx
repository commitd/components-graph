import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import {
  EdgeDecoration,
  GraphLayout,
  GraphRenderer,
  GraphRendererOptions,
  NodeDecoration,
} from '../types'
import CytoscapeComponent from 'react-cytoscapejs'
import { useDebouncedCallback } from 'use-debounce'
import {
  Css,
  EdgeDataDefinition,
  ElementDefinition,
  NodeDataDefinition,
  LayoutOptions,
  use,
  NodeCollection,
  EdgeCollection,
  Stylesheet,
  EdgeSingular,
} from 'cytoscape'
import { forceDirected } from '../layouts/ForceDirected'
import { GraphModel } from '../GraphModel'
import { circle } from '../layouts/Circle'
import { grid } from '../layouts/Grid'
//@ts-ignore
import ccola from 'cytoscape-cola'
import { cola } from '../layouts/Cola'
import {
  CustomLayoutOptions,
  CytoscapeGraphLayoutAdapter,
} from './CytoscapeGraphLayoutAdapter'
import { SelectionModel } from '../SelectionModel'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CyGraphRendererOptions extends GraphRendererOptions {}

use(ccola)
use(CytoscapeGraphLayoutAdapter.register)

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
  const s = {
    'line-color': e.color,
    'target-arrow-color': e.color,
    // @ts-ignore
    'line-opacity': e.opacity,
  }
  if (Object.values(s).every((v) => v == null)) {
    return undefined
  } else {
    return s
  }
}

export class CytoscapeRenderer
  implements GraphRenderer<CyGraphRendererOptions> {
  render(
    graphModel: GraphModel,
    onChange: (
      model: GraphModel | ((model2: GraphModel) => GraphModel)
    ) => void,
    options: CyGraphRendererOptions
  ): React.ReactNode {
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
    const nodes = graphModel.getCurrentContent().nodes
    const edges = graphModel.edges
    const selection = graphModel.getSelection()
    const cyRef = useRef<cytoscape.Core>()
    const layoutStart = useRef<number>()
    const dirty = graphModel.getCurrentLayout().isDirty()
    const layout = graphModel.getCurrentLayout().getLayout()

    // prevent rapid selection updates from fighting each other
    // and improve performance overheads by debouncing selection updates
    const triggerLayout = useDebouncedCallback((graphLayout: GraphLayout) => {
      if (cyRef.current != null) {
        const l = layouts[graphLayout]
        if (l == null) {
          throw new Error('Layout does not exist')
        }
        cyRef.current.layout(l).run()
      }
    }, 200)
    const pendingSelection = useRef<SelectionModel>(selection)
    useEffect(() => {
      pendingSelection.current = selection
    }, [selection])
    const selectionUpdate = useDebouncedCallback(() => {
      if (pendingSelection.current != null) {
        onChange(
          GraphModel.applySelection(graphModel, pendingSelection.current)
        )
      }
    }, 100)

    const updateSelection = useCallback(
      (updater: (s: SelectionModel) => SelectionModel) => {
        pendingSelection.current = updater(pendingSelection.current)
        selectionUpdate.callback()
      },
      [pendingSelection, selectionUpdate]
    )

    const cy = cyRef.current
    useEffect(() => {
      if (cy == null) {
        return
      }
      // @ts-ignore
      cy.removeAllListeners()
      cy.on('add remove', 'edge', () => {
        triggerLayout.callback(layout)
      })
      cy.on('resize', () => {
        triggerLayout.callback(layout)
      })
      cy.on('add remove', 'node', () => {
        triggerLayout.callback(layout)
      })
      cy.on('select', 'node', (e) => {
        const selectedNodes = e.target as NodeCollection
        updateSelection((s) => s.addNodes(selectedNodes.map((n) => n.id())))
      })
      cy.on('unselect', 'node', (e) => {
        const selectedNodes = e.target as NodeCollection
        updateSelection((s) => s.removeNodes(selectedNodes.map((n) => n.id())))
      })
      cy.on('select', 'edge', (e) => {
        const selectedEdges = e.target as EdgeCollection
        updateSelection((s) => s.addEdges(selectedEdges.map((n) => n.id())))
      })
      cy.on('unselect', 'edge', (e) => {
        const selectedEdges = e.target as EdgeCollection
        updateSelection((s) => s.removeEdges(selectedEdges.map((n) => n.id())))
      })
      cy.on('layoutstart', () => {
        console.log('Layout started')
        layoutStart.current = Date.now()
      })
      cy.on('layoutstop', () => {
        if (layoutStart.current != null) {
          console.log(`Layout took ${Date.now() - layoutStart.current}ms`)
        }
      })
    }, [cy, layout, triggerLayout, updateSelection])

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

    const elements = useMemo(
      () => [
        ...Object.values(nodes).map((n) => {
          const node: NodeDataDefinition = {
            id: n.id,
            label: n.label,
            model: n,
          }
          const element: ElementDefinition = {
            data: node,
            style: toNodeCyStyle(
              graphModel.getDecorators().getNodeDectorationOverrides(n)
            ),
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
          const element: ElementDefinition = {
            data: edge,
            style: toEdgeCyStyle(e),
            classes: 'bezier',
          }
          return element
        }),
      ],
      [nodes, edges, selection, graphModel]
    )

    const nodeDefaults = graphModel.getDecorators().getNodeDefaults()
    const edgeDefaults = graphModel.getDecorators().getEdgeDefaults()
    const defaultNodeStyles: Stylesheet = useMemo(
      () => ({
        selector: 'node',
        style: {
          label: 'data(label)',
          // label styles
          'text-background-color': '#FFF',
          'text-background-opacity': 0.7,
          'text-margin-y': -4,
          'text-background-shape': 'roundrectangle',

          // icon styles
          'background-width': '100%',
          'background-height': '100%',
          'border-width': (e) => {
            const strokeSize = graphModel.getNode(e.id()).strokeSize
            return e.selected() ? strokeSize * 3 : strokeSize
          },
          ...toNodeCyStyle(nodeDefaults),
        },
      }),
      [nodeDefaults, graphModel]
    )
    const defaultEdgeStyles: Stylesheet = useMemo(
      () => ({
        selector: 'edge',
        style: {
          label: 'data(label)',
          // label styles
          'text-background-color': '#FFF',
          'text-background-opacity': 0.7,
          'text-margin-y': -4,
          'text-background-shape': 'roundrectangle',
          'target-arrow-shape': 'triangle',
          'target-endpoint': 'outside-to-node-or-label',
          width: (e: EdgeSingular) => {
            const size = graphModel.getEdge(e.id()).size
            return e.selected() ? size * 3 : size
          },
          ...toEdgeCyStyle(edgeDefaults),
        },
      }),
      [edgeDefaults, graphModel]
    )

    return (
      <CytoscapeComponent
        elements={elements}
        style={{
          width:
            options.width == null || options.width === 'full-width'
              ? '100%'
              : options.width,
          height: options.height === 'full-height' ? '100%' : options.height,
          backgroundColor: '#FFF',
          overflow: 'hidden',
        }}
        cy={(cy): void => {
          cyRef.current = cy
        }}
        stylesheet={[defaultNodeStyles, defaultEdgeStyles]}
      />
    )
  }

  defaultOptions: CyGraphRendererOptions = {
    height: 300,
  }
}
