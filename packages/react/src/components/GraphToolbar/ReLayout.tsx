import { MenuCheckboxItem } from '@committed/ds'
import { GraphModel } from '@committed/graph'
import React, { ComponentProps, useCallback } from 'react'

export type ReLayoutProps = Pick<
  ComponentProps<typeof MenuCheckboxItem>,
  'css' | 'destructive'
> & {
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
