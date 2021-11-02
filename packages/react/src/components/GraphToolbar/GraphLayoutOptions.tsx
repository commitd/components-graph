/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CSSProps,
  Menu,
  MenuContent,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTriggerItem,
  VariantProps,
} from '@committed/components'
import { GraphLayout, GraphModel } from '@committed/graph'
import React, { useCallback, useMemo } from 'react'

function capitalize(key: string) {
  return key.charAt(0).toUpperCase() + key.slice(1)
}

function getCurrentLayout(model: GraphModel): string {
  const curr = model.getCurrentLayout().getLayout()
  if (typeof curr === 'string') {
    return curr
  } else {
    return curr.name
  }
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
          if (typeof curr === 'string') {
            prev[curr] = (m) =>
              GraphModel.applyLayout(m, m.getCurrentLayout().presetLayout(curr))
          } else {
            prev[curr.name] = (m) =>
              GraphModel.applyLayout(m, m.getCurrentLayout().customLayout(curr))
          }
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
    <Menu css={css as any} {...props}>
      <MenuTriggerItem>Graph Layout</MenuTriggerItem>
      <MenuContent>
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
      </MenuContent>
    </Menu>
  )
}
