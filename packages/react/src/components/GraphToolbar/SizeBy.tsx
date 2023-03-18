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
import { GraphModel, sizeNodeByMetadata } from '@committed/graph'
import React, { useCallback, useMemo } from 'react'

function capitalize(key: string) {
  return key.charAt(0).toUpperCase() + key.slice(1)
}

const PREFIX = 'sizeNodeBy-'

export type SizeByProps = CSSProps &
  VariantProps<typeof Menu> & {
    /** Declarative definition of graph state */
    model: GraphModel
    /** The graph model change callback */
    onModelChange: (
      model: GraphModel | ((model2: GraphModel) => GraphModel)
    ) => void
  }

/**
 * A GraphToolbar sub-component adds controls for sizing by an key
 */
export const SizeBy: React.VFC<SizeByProps> = ({
  model,
  onModelChange,
  css,
  ...props
}) => {
  const nodeAttributes: string[] = useMemo(
    () =>
      Object.entries(model.getNodeMetadataTypes())
        .filter((a) => a[1].has('number'))
        .map((a) => a[0]),
    [model]
  )

  const selectedMetadataKey: string | undefined = useMemo(
    () =>
      model
        .getDecorators()
        .getNodeDecoratorIds()
        .find((a) => a.startsWith(PREFIX)),
    [model]
  )

  const handleSizeNodeByDecoration = useCallback(
    (key: string): void => {
      let decoratorModel = model.getDecorators()
      if (selectedMetadataKey) {
        decoratorModel =
          decoratorModel.removeNodeDecoratorById(selectedMetadataKey)
      }
      if (key !== 'none') {
        const newSizeByNode = sizeNodeByMetadata(model.getCurrentContent(), key)
        newSizeByNode.id = PREFIX + key
        decoratorModel = decoratorModel.addNodeDecorator(newSizeByNode)
      }

      onModelChange(GraphModel.applyDecoration(model, decoratorModel))
    },
    [model, onModelChange, selectedMetadataKey]
  )

  if (nodeAttributes.length === 0) {
    return null
  }

  return (
    <MenuSub {...props}>
      <MenuSubTrigger>Size nodes by</MenuSubTrigger>
      <MenuSubContent css={css as any}>
        <MenuRadioGroup
          value={
            selectedMetadataKey
              ? selectedMetadataKey.substring(PREFIX.length)
              : 'none'
          }
          onValueChange={handleSizeNodeByDecoration}
        >
          <MenuRadioItem key="none" value={'none'}>
            None
          </MenuRadioItem>
          {nodeAttributes.map((l) => (
            <MenuRadioItem key={l} value={l}>
              {capitalize(l)}
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </MenuSubContent>
    </MenuSub>
  )
}
