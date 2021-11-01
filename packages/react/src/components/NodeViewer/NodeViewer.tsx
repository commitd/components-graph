import {
  Dialog,
  DialogContent,
  DialogTitle,
  Input,
} from '@committed/components'
import { ModelNode } from '@committed/graph'
import React from 'react'
import { EmptyState } from '../EmptyState'

type NodeModalProps = React.ComponentProps<typeof Dialog> & {
  /** The node to show */
  node?: ModelNode
}

/**
 * NodeViewer component
 */
export const NodeViewer: React.FC<NodeModalProps> = ({
  node,
  ...props
}: NodeModalProps) => {
  return (
    <Dialog {...props}>
      <DialogContent>
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
      </DialogContent>
    </Dialog>
  )
}
