import { Box, Dialog, DialogContent, DialogTitle, Input } from '@committed/ds'
import { ModelNode } from '@committed/graph'
import React from 'react'
import { EmptyState } from '../EmptyState'

type NodeModalProps = React.ComponentProps<typeof Dialog> &
  Pick<React.ComponentProps<typeof DialogContent>, 'defaultClose'> & {
    /** The node to show */
    node?: ModelNode
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
            <>
              <DialogTitle>{node.label}</DialogTitle>
              {Object.keys(node.attributes).length === 0 ? (
                <EmptyState message="No attributes to view" />
              ) : null}
              {Object.entries(node.attributes).map(
                ([attributeId, attributeValue]) => (
                  <Input
                    key={attributeId}
                    value={attributeValue as string}
                    label={attributeId}
                    readOnly
                  />
                )
              )}
            </>
          ) : (
            <EmptyState message="No node selected" />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}
