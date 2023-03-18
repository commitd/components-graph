import { Node } from '@committed/graph'
import React from 'react'
import { renderDark, renderLight } from '../../test/setup'
import { NodeViewer } from './NodeViewer'

export const WithMetadata: React.FC = () => {
  const node: Node = {
    id: 'test',
    label: 'example node',
    metadata: {
      employer: 'Committed',
    },
  }
  return <NodeViewer open node={node} />
}

export const NoMetadata: React.FC = () => {
  const node: Node = {
    id: 'test',
    label: 'example node',
    metadata: {},
  }
  return <NodeViewer open node={node} />
}

export const NoNode: React.FC = () => <NodeViewer open />

it('renders light with metadata', () => {
  const { asFragment } = renderLight(<WithMetadata />)
  expect(asFragment()).toBeDefined()
})

it('renders dark with no metadata', () => {
  const { asFragment } = renderDark(<NoMetadata />)
  expect(asFragment()).toBeDefined()
})
it('renders with no node', () => {
  const { asFragment } = renderDark(<NoNode />)
  expect(asFragment()).toBeDefined()
})
