import { MenuCheckboxItem, Prettify } from '@committed/ds'
import { GraphModel } from '@committed/graph'
import React, { ComponentProps, useCallback } from 'react'

export type HideProps = Prettify<
  Partial<
    Pick<ComponentProps<typeof MenuCheckboxItem>, 'css' | 'destructive'>
  > & {
    /** Declarative definition of graph state */
    model: GraphModel
    /** The graph model change callback */
    onModelChange: (
      model: GraphModel | ((model2: GraphModel) => GraphModel)
    ) => void
  }
>

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
      <MenuCheckboxItem
        css={css}
        {...props}
        key="hideNodeLabels"
        checked={model.getDecorators().isHideNodeLabels()}
        onCheckedChange={handleToggleHideNodeLabels}
      >
        Hide node labels
      </MenuCheckboxItem>
      <MenuCheckboxItem
        css={css}
        {...props}
        key="hideEdgeLabels"
        checked={model.getDecorators().isHideEdgeLabels()}
        onCheckedChange={handleToggleHideEdgeLabels}
      >
        Hide edge labels
      </MenuCheckboxItem>
    </>
  )
}
