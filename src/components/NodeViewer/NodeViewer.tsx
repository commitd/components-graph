import {
  DialogProps,
  Dialog,
  TextField,
  DialogTitle,
  Flex,
  DialogContent,
  DialogActions,
  Button,
} from '@committed/components'
import React from 'react'
import { ModelNode } from '../../graph'
import { EmptyState } from '../EmptyState'

export type NodeModalProps = Omit<DialogProps, 'open'> & {
  node?: ModelNode
  onClose: () => void
}

/**
 * NodeViewer component
 */
export const NodeViewer: React.FC<NodeModalProps> = ({
  node,
  onClose,
  ...modalProps
}) => {
  return (
    <Dialog
      onClose={onClose}
      open={node != null}
      fullWidth
      maxWidth="sm"
      transitionDuration={0}
      {...modalProps}
    >
      {node != null ? (
        <>
          <DialogTitle>{node.label}</DialogTitle>
          <DialogContent>
            {Object.keys(node.attributes).length === 0 ? (
              <EmptyState message="No attributes to view." />
            ) : null}
            <Flex flexDirection="column" gap={3}>
              {Object.entries(node.attributes).map(
                ([attributeId, attributeValue]) => (
                  <TextField
                    key={attributeId}
                    value={attributeValue}
                    label={attributeId}
                  />
                )
              )}
            </Flex>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Close</Button>
          </DialogActions>
        </>
      ) : null}
    </Dialog>
  )
}
