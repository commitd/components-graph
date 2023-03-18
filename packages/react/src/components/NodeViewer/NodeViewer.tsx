import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Input,
  Stack,
} from '@committed/components'
import { Node } from '@committed/graph'
import React from 'react'
import { EmptyState } from '../EmptyState'

type NodeModalProps = React.ComponentProps<typeof Dialog> &
  Pick<React.ComponentProps<typeof DialogContent>, 'defaultClose'> & {
    /** The node to show */
    node?: Node
  }

/**
 * NodeViewer component
 */
export const NodeViewer: React.FC<NodeModalProps> = ({
  node,
  defaultClose,
  ...props
}: NodeModalProps) => {
  return (
    <Dialog {...props}>
      <DialogContent css={{ paddingRight: 0 }} defaultClose={defaultClose}>
        <Box css={{ overflowY: 'auto', paddingRight: 20 }}>
          {node != null ? (
            <Stack>
              <DialogTitle>{node.label}</DialogTitle>
              {Object.keys(node.metadata).length === 0 ? (
                <EmptyState message="No attributes to view" />
              ) : null}
              {Object.entries(node.metadata).map(([key, value]) => (
                <Input key={key} value={value as string} label={key} readOnly />
              ))}
            </Stack>
          ) : (
            <EmptyState message="No node selected" />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}
