import {
  Box,
  Flex,
  FlexProps,
  IconButton,
  IconButtonProps,
  Menu,
  MenuItem,
} from '@committed/components'
import {
  Check,
  Settings,
  Timeline,
  ZoomIn,
  ZoomOut,
  ZoomOutMap,
} from '@material-ui/icons'
import React, { ComponentProps, forwardRef, useState } from 'react'
import { GraphLayout } from '../../graph'
import { GraphModel } from '../../graph/GraphModel'

export interface GraphToolbarProps extends Omit<FlexProps, 'flexDirection'> {
  /** Declarative definition of graph state */
  model: GraphModel
  /** The graph model change callback */
  onModelChange: (
    model: GraphModel | ((model2: GraphModel) => GraphModel)
  ) => void
  /** List of possible layouts. These can be obtained from the graph renderer e.g. cytoscapeRenderer.layouts */
  layouts?: GraphLayout[]
  /** The direction of the toolbar */
  flexDirection?: 'row' | 'column'
  /** Props passed to all icons */
  iconProps?: Omit<IconButtonProps, 'onClick'>
}

const SelectableMenuItem: React.FC<
  ComponentProps<typeof MenuItem> & { selected: boolean }
> = forwardRef(({ selected, children, ...itemProps }, ref) => {
  return (
    <MenuItem {...itemProps} ref={ref}>
      <Flex>
        <Box mr={2}>
          <Check
            style={{
              visibility: selected ? 'inherit' : 'hidden',
            }}
          />
        </Box>
        {children}
      </Flex>
    </MenuItem>
  )
})
SelectableMenuItem.displayName = 'SelectableMenuItem'

/**
 * GraphToolbar component adds controls for zoom, layout and refit.
 *
 * Also supports flex props to control layout of toolbar.
 */
export const GraphToolbar: React.FC<GraphToolbarProps> = ({
  model,
  onModelChange,
  iconProps,
  layouts = [],
  ...props
}) => {
  const [settingsMenuAnchor, setSettingsMenuAnchor] = useState<HTMLElement>()
  const [settingsLayoutMenuAnchor, setSettingsLayoutMenuAnchor] =
    useState<HTMLElement>()
  const handleCloseSettings = (): void => {
    setSettingsMenuAnchor(undefined)
    setSettingsLayoutMenuAnchor(undefined)
  }
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
  return (
    <Flex {...props}>
      <IconButton
        aria-label="zoom-in"
        title="Zoom in"
        {...iconProps}
        onClick={() => onModelChange(model.pushCommand({ type: 'ZoomIn' }))}
      >
        <ZoomIn />
      </IconButton>
      <IconButton
        aria-label="zoom-out"
        title="Zoom out"
        {...iconProps}
        onClick={() => onModelChange(model.pushCommand({ type: 'ZoomOut' }))}
      >
        <ZoomOut />
      </IconButton>
      <IconButton
        aria-label="layout"
        title="Layout"
        {...iconProps}
        onClick={() => onModelChange(model.pushCommand({ type: 'Layout' }))}
      >
        <Timeline />
      </IconButton>
      <IconButton
        aria-label="refit"
        title="Refit"
        {...iconProps}
        onClick={() => onModelChange(model.pushCommand({ type: 'Refit' }))}
      >
        <ZoomOutMap />
      </IconButton>
      <IconButton
        aria-label="settings"
        title="Settings"
        {...iconProps}
        onClick={(e) => setSettingsMenuAnchor(e.currentTarget)}
      >
        <Settings />
      </IconButton>
      <Menu
        anchorEl={settingsMenuAnchor}
        keepMounted
        open={Boolean(settingsMenuAnchor)}
        onClose={handleCloseSettings}
      >
        <SelectableMenuItem
          selected={model.getDecorators().isHideNodeLabels()}
          onClick={() => {
            handleCloseSettings()
            handleToggleHideNodeLabels()
          }}
        >
          Hide node labels
        </SelectableMenuItem>
        <SelectableMenuItem
          selected={model.getDecorators().isHideEdgeLabels()}
          onClick={() => {
            handleCloseSettings()
            handleToggleHideEdgeLabels()
          }}
        >
          Hide edge labels
        </SelectableMenuItem>
        {layouts.length > 0 ? (
          <SelectableMenuItem
            selected={false}
            onClick={(e) => setSettingsLayoutMenuAnchor(e.currentTarget)}
          >
            Graph Layout...
          </SelectableMenuItem>
        ) : null}
      </Menu>
      <Menu
        anchorEl={settingsLayoutMenuAnchor}
        keepMounted
        open={Boolean(settingsLayoutMenuAnchor)}
        onClose={handleCloseSettings}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        {layouts.map((l) =>
          typeof l === 'string' ? (
            <SelectableMenuItem
              key={l}
              onClick={() => {
                onModelChange(
                  GraphModel.applyLayout(
                    model,
                    model.getCurrentLayout().presetLayout(l)
                  )
                )
                handleCloseSettings()
              }}
              selected={model.getCurrentLayout().getLayout() === l}
            >
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </SelectableMenuItem>
          ) : (
            <SelectableMenuItem
              key={l.name}
              onClick={() => {
                onModelChange(
                  GraphModel.applyLayout(
                    model,
                    model.getCurrentLayout().customLayout(l)
                  )
                )
                handleCloseSettings()
              }}
              selected={model.getCurrentLayout().getLayout() === l}
            >
              {l.name.charAt(0).toUpperCase() + l.name.slice(1)}
            </SelectableMenuItem>
          )
        )}
      </Menu>
    </Flex>
  )
}
