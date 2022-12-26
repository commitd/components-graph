/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CSSProps,
  Menu,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  VariantProps,
} from '@committed/components'
import { GraphLayout, GraphModel, isCustomGraphLayout } from '@committed/graph'
import React, { useCallback, useMemo } from 'react'

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

export type GraphLayoutOptionsProps = CSSProps &
  VariantProps<typeof Menu> & {
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
  css,
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
      <MenuSubContent css={css as any}>
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
