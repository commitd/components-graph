/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CSS,
  CSSProps,
  IconButton,
  Menu,
  MenuContent,
  MenuItemCheckbox,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
  MenuTriggerItem,
  StitchesVariants,
  styled,
} from '@committed/components'
import {
  mdiArrowExpandAll as refitPath,
  mdiChartTimelineVariant as layoutPath,
  mdiCog as settingPath,
  mdiMagnifyMinus as zoomOutPath,
  mdiMagnifyPlus as zoomInPath,
} from '@mdi/js'
import React, { ComponentProps } from 'react'
import { GraphLayout } from '../../graph'
import { GraphModel } from '../../graph/GraphModel'

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
const StyledToolbar = styled('div', {
  display: 'flex',
  variants: {
    direction: {
      row: {
        flexDirection: 'row',
      },
      column: {
        flexDirection: 'column',
      },
    },
    align: {
      start: { justifyContent: 'flex-start' },
      end: { justifyContent: 'flex-end' },
    },
    overlay: {
      true: {
        position: 'absolute',
        zIndex: '1',
      },
    },
  },
  defaultVariants: {
    direction: 'column',
    align: 'start',
  },
  compoundVariants: [
    {
      overlay: true,
      direction: 'row',
      align: 'start',
      css: { top: 0, left: 0 },
    },
    {
      overlay: true,
      direction: 'row',
      align: 'end',
      css: { top: 0, right: 0 },
    },
    { overlay: true, direction: 'column', align: 'start', css: { top: 0 } },
    { overlay: true, direction: 'column', align: 'end', css: { bottom: 0 } },
  ],
})

export type GraphToolbarProps = CSSProps &
  StitchesVariants<typeof StyledToolbar> & {
    /** Declarative definition of graph state */
    model: GraphModel
    /** The graph model change callback */
    onModelChange: (
      model: GraphModel | ((model2: GraphModel) => GraphModel)
    ) => void
    /** List of possible layouts. These can be obtained from the graph renderer e.g. cytoscapeRenderer.layouts */
    layouts?: GraphLayout[]
    /** Props passed to all icons */
    iconStyle?: CSS
    buttonVariant?: ComponentProps<typeof IconButton>['variant']
  }

/**
 * GraphToolbar component adds controls for zoom, layout and refit.
 *
 * Also supports flex props to control layout of toolbar.
 */
export const GraphToolbar: React.FC<GraphToolbarProps> = ({
  model,
  onModelChange,
  iconStyle,
  layouts = [],
  buttonVariant = 'tertiary',
  css,
  ...props
}) => {
  const layoutMap = layouts.reduce<
    Record<string, (m: GraphModel) => GraphModel>
  >((prev, curr) => {
    if (typeof curr === 'string') {
      prev[curr] = (m) =>
        GraphModel.applyLayout(m, m.getCurrentLayout().presetLayout(curr))
    } else {
      prev[curr.name] = (m) =>
        GraphModel.applyLayout(m, m.getCurrentLayout().customLayout(curr))
    }
    return prev
  }, {})

  const currentLayout = getCurrentLayout(model)

  const handleToggleHideNodeLabels = (): void => {
    onModelChange(
      GraphModel.applyDecoration(
        model,
        model
          .getDecorators()
          .hideNodeLabels(!model.getDecorators().isHideNodeLabels())
      )
    )
  }
  const handleToggleHideEdgeLabels = (): void => {
    onModelChange(
      GraphModel.applyDecoration(
        model,
        model
          .getDecorators()
          .hideEdgeLabels(!model.getDecorators().isHideEdgeLabels())
      )
    )
  }

  const handleSelectLayout = (newLayout: string): void => {
    onModelChange(layoutMap[newLayout](model))
  }

  return (
    <StyledToolbar css={css as any} {...props}>
      <IconButton
        variant={buttonVariant}
        aria-label="zoom-in"
        title="Zoom in"
        path={zoomInPath}
        css={iconStyle as any}
        onClick={() => onModelChange(model.pushCommand({ type: 'ZoomIn' }))}
      />
      <IconButton
        variant={buttonVariant}
        aria-label="zoom-out"
        title="Zoom out"
        path={zoomOutPath}
        css={iconStyle as any}
        onClick={() => onModelChange(model.pushCommand({ type: 'ZoomOut' }))}
      />
      <IconButton
        variant={buttonVariant}
        aria-label="layout"
        title="Layout"
        path={layoutPath}
        css={iconStyle as any}
        onClick={() => onModelChange(model.pushCommand({ type: 'Layout' }))}
      />
      <IconButton
        variant={buttonVariant}
        aria-label="refit"
        title="Refit"
        path={refitPath}
        css={iconStyle as any}
        onClick={() => onModelChange(model.pushCommand({ type: 'Refit' }))}
      />
      <Menu>
        <MenuTrigger>
          <IconButton
            variant={buttonVariant}
            aria-label="settings"
            title="Settings"
            path={settingPath}
            css={iconStyle as any}
          />
        </MenuTrigger>
        <MenuContent>
          <MenuItemCheckbox
            checked={model.getDecorators().isHideNodeLabels()}
            onCheckedChange={handleToggleHideNodeLabels}
          >
            Hide node labels
          </MenuItemCheckbox>
          <MenuItemCheckbox
            checked={model.getDecorators().isHideEdgeLabels()}
            onCheckedChange={handleToggleHideEdgeLabels}
          >
            Hide edge labels
          </MenuItemCheckbox>
          {Object.keys(layoutMap).length > 0 ? (
            <Menu>
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
          ) : null}
        </MenuContent>
      </Menu>
    </StyledToolbar>
  )
}
