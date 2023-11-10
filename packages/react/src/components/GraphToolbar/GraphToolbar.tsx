import {
  IconButton,
  Menu,
  MenuContent,
  MenuTrigger,
  Prettify,
} from '@committed/ds'
import { styled } from '@committed/ds-ss'
import { GraphLayout, GraphModel } from '@committed/graph'
import { mdiCog as settingPath } from '@mdi/js'
import React, { ComponentProps, useMemo } from 'react'
import { GraphLayoutOptions } from './GraphLayoutOptions'
import { GraphLayoutRun } from './GraphLayoutRun'
import { Hide } from './Hide'
import { Refit } from './Refit'
import { ReLayout } from './ReLayout'
import { SizeBy } from './SizeBy'
import { Zoom } from './Zoom'

const StyledToolbar = styled('div', {
  base: {
    display: 'flex',
  },
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

export type GraphToolbarProps = Prettify<
  Partial<
    Pick<
      ComponentProps<typeof StyledToolbar>,
      'css' | 'direction' | 'overlay' | 'align'
    >
  > & {
    /** Declarative definition of graph state */
    model: GraphModel
    /** The graph model change callback */
    onModelChange: (
      model: GraphModel | ((model2: GraphModel) => GraphModel)
    ) => void
    /** List of possible layouts. These can be obtained from the graph renderer e.g. cytoscapeRenderer.layouts */
    layouts?: GraphLayout[]
    zoom?: boolean
    layout?: boolean
    relayout?: boolean
    refit?: boolean
    hide?: boolean
    size?: boolean
    /** Props passed to all icons */
    iconStyle?: ComponentProps<typeof IconButton>['css']
    buttonVariant?: ComponentProps<typeof IconButton>['variant']
    children?: React.ReactNode
  }
>

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
  zoom = true,
  layout = true,
  relayout = true,
  refit = true,
  hide = true,
  size = true,
  buttonVariant = 'text',
  children,
  ...props
}) => {
  const menuItems = useMemo(() => {
    const items = []

    if (hide) {
      items.push(
        <Hide key="hide" model={model} onModelChange={onModelChange} />
      )
    }

    if (size) {
      items.push(
        <SizeBy key="sizeNodeBy" model={model} onModelChange={onModelChange} />
      )
    }

    if (relayout) {
      items.push(
        <ReLayout key="relayout" model={model} onModelChange={onModelChange} />
      )
    }

    if (layout && layouts.length > 0) {
      items.push(
        <GraphLayoutOptions
          key="layouts"
          model={model}
          onModelChange={onModelChange}
          layouts={layouts}
        />
      )
    }
    return items.filter((item) => item !== null)
  }, [hide, layout, layouts, model, onModelChange, size, relayout])

  return (
    <StyledToolbar {...props}>
      {zoom && (
        <Zoom
          variant={buttonVariant}
          css={iconStyle}
          model={model}
          onModelChange={onModelChange}
        />
      )}
      {layouts.length > 0 && layout && (
        <GraphLayoutRun
          variant={buttonVariant}
          css={iconStyle}
          model={model}
          onModelChange={onModelChange}
        />
      )}
      {refit && (
        <Refit
          variant={buttonVariant}
          css={iconStyle}
          model={model}
          onModelChange={onModelChange}
        />
      )}
      {children}
      {menuItems.length > 0 && (
        <Menu>
          <MenuTrigger>
            <IconButton
              variant={buttonVariant}
              aria-label="settings"
              title="Settings"
              path={settingPath}
              css={iconStyle}
            />
          </MenuTrigger>
          <MenuContent>{menuItems}</MenuContent>
        </Menu>
      )}
    </StyledToolbar>
  )
}
