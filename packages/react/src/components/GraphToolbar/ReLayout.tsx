/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CSSProps, MenuCheckboxItem, VariantProps } from '@committed/components'
import { GraphModel } from '@committed/graph'
import React, { useCallback } from 'react'

export type ReLayoutProps = CSSProps &
  VariantProps<typeof MenuCheckboxItem> & {
    /** Declarative definition of graph state */
    model: GraphModel
    /** The graph model change callback */
    onModelChange: (
      model: GraphModel | ((model2: GraphModel) => GraphModel)
    ) => void
  }

/**
 * A GraphToolbar sub-component to relayout on graph change
 */
export const ReLayout: React.FC<ReLayoutProps> = ({
  model,
  onModelChange,
  css,
  ...props
}) => {
  const handleToggle = useCallback((): void => {
    onModelChange(
      GraphModel.applyLayout(
        model,
        model
          .getCurrentLayout()
          .setOnChange(!model.getCurrentLayout().isOnChange())
      )
    )
  }, [model, onModelChange])

  return (
    <>
      <MenuCheckboxItem
        css={css as any}
        {...props}
        key="hideEdgeLabels"
        checked={model.getCurrentLayout().isOnChange()}
        onCheckedChange={handleToggle}
      >
        Layout on change
      </MenuCheckboxItem>
    </>
  )
}
