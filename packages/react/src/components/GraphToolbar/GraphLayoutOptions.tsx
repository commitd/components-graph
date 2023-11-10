/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Menu,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
} from '@committed/ds'
import { GraphLayout, GraphModel, isCustomGraphLayout } from '@committed/graph'
import React, { ComponentProps, useCallback, useMemo } from 'react'

function capitalize(key: string) {
  return key.charAt(0).toUpperCase() + key.slice(1)
}

function getCurrentLayout(model: GraphModel) {
  const curr = model.getCurrentLayout().getLayout()
  if (isCustomGraphLayout(curr)) {
    return curr.name
  }
  return curr
}

export type GraphLayoutOptionsProps = ComponentProps<typeof Menu> & {
  /** Declarative definition of graph state */
  model: GraphModel
  /** The graph model change callback */
  onModelChange: (
    model: GraphModel | ((model2: GraphModel) => GraphModel)
  ) => void
  /** List of possible layouts. These can be obtained from the graph renderer e.g. cytoscapeRenderer.layouts */
  layouts?: GraphLayout[]
}

/**
 * GraphLayoutOptions component adds controls for layout to GraphToolbar.
 */
export const GraphLayoutOptions: React.VFC<GraphLayoutOptionsProps> = ({
  model,
  onModelChange,
  layouts = [],
  ...props
}) => {
  const layoutMap = useMemo(
    () =>
      layouts.reduce<Record<string, (m: GraphModel) => GraphModel>>(
        (prev, curr) => {
          const key = isCustomGraphLayout(curr) ? curr.name : curr
          prev[key] = (m) =>
            GraphModel.applyLayout(m, m.getCurrentLayout().setLayout(curr))
          return prev
        },
        {}
      ),
    [layouts]
  )

  const currentLayout = getCurrentLayout(model)

  const handleSelectLayout = useCallback(
    (newLayout: string): void => {
      onModelChange(layoutMap[newLayout](model))
    },
    [layoutMap, model, onModelChange]
  )

  return (
    <MenuSub {...props}>
      <MenuSubTrigger>Graph Layout</MenuSubTrigger>
      <MenuSubContent>
        <MenuRadioGroup
          value={currentLayout}
          onValueChange={handleSelectLayout}
        >
          {Object.keys(layoutMap).map((l) => (
            <MenuRadioItem key={l} value={l}>
              {capitalize(l)}
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </MenuSubContent>
    </MenuSub>
  )
}
