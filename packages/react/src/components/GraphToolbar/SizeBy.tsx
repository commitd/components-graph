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
import React, { useCallback, useMemo } from 'react'
import { GraphModel, sizeNodeByAttribute } from '../../graph'

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
 * A GraphToolbar sub-component adds controls for sizing by an attribute
 */
export const SizeBy: React.VFC<SizeByProps> = ({
  model,
  onModelChange,
  css,
  ...props
}) => {
  const nodeAttributes: string[] = useMemo(
    () =>
      Object.entries(model.getNodeAttributes())
        .filter((a) => a[1].has('number'))
        .map((a) => a[0]),
    [model]
  )

  const selectedNodeAttributes: string | undefined = useMemo(
    () =>
      model
        .getDecorators()
        .getNodeDecoratorIds()
        .find((a) => a.startsWith(PREFIX)),
    [model]
  )

  const handleSizeNodeByDecoration = useCallback(
    (attribute: string): void => {
      let decoratorModel = model.getDecorators()
      if (selectedNodeAttributes) {
        decoratorModel = decoratorModel.removeNodeDecoratorById(
          selectedNodeAttributes
        )
      }
      if (attribute !== 'none') {
        const newSizeByNode = sizeNodeByAttribute(
          model.getCurrentContent(),
          attribute
        )
        newSizeByNode.id = PREFIX + attribute
        decoratorModel = decoratorModel.addNodeDecorator(newSizeByNode)
      }

      onModelChange(GraphModel.applyDecoration(model, decoratorModel))
    },
    [model, onModelChange, selectedNodeAttributes]
  )

  if (nodeAttributes.length === 0) {
    return null
  }

  return (
    <Menu css={css as any} {...props}>
      <MenuTriggerItem>Size nodes by</MenuTriggerItem>
      <MenuContent>
        <MenuRadioGroup
          value={
            selectedNodeAttributes
              ? selectedNodeAttributes.substring(PREFIX.length)
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
      </MenuContent>
    </Menu>
  )
}
