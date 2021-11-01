/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CSSProps, MenuItemCheckbox, VariantProps } from '@committed/components'
import { GraphModel } from '@committed/graph'
import React, { useCallback } from 'react'

export type HideProps = CSSProps &
  VariantProps<typeof MenuItemCheckbox> & {
    /** Declarative definition of graph state */
    model: GraphModel
    /** The graph model change callback */
    onModelChange: (
      model: GraphModel | ((model2: GraphModel) => GraphModel)
    ) => void
  }

/**
 * A GraphToolbar sub-component adds controls for hiding edges and nodes
 */
export const Hide: React.FC<HideProps> = ({
  model,
  onModelChange,
  css,
  ...props
}) => {
  const handleToggleHideNodeLabels = useCallback((): void => {
    onModelChange(
      GraphModel.applyDecoration(
        model,
        model
          .getDecorators()
          .hideNodeLabels(!model.getDecorators().isHideNodeLabels())
      )
    )
  }, [model, onModelChange])

  const handleToggleHideEdgeLabels = useCallback((): void => {
    onModelChange(
      GraphModel.applyDecoration(
        model,
        model
          .getDecorators()
          .hideEdgeLabels(!model.getDecorators().isHideEdgeLabels())
      )
    )
  }, [model, onModelChange])

  return (
    <>
      <MenuItemCheckbox
        css={css as any}
        {...props}
        key="hideNodeLabels"
        checked={model.getDecorators().isHideNodeLabels()}
        onCheckedChange={handleToggleHideNodeLabels}
      >
        Hide node labels
      </MenuItemCheckbox>
      <MenuItemCheckbox
        css={css as any}
        {...props}
        key="hideEdgeLabels"
        checked={model.getDecorators().isHideEdgeLabels()}
        onCheckedChange={handleToggleHideEdgeLabels}
      >
        Hide edge labels
      </MenuItemCheckbox>
    </>
  )
}
