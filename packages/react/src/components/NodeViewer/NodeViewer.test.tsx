import { ModelNode } from '@committed/graph'
import React from 'react'
import { renderDark, renderLight } from '../../test/setup'
import { NodeViewer } from './NodeViewer'

export const WithAttributes: React.FC = () => {
  const node: ModelNode = {
    id: 'test',
    label: 'example node',
    attributes: {
      employer: 'Committed',
    },
  }
  return <NodeViewer open node={node} />
}

export const NoAttributes: React.FC = () => {
  const node: ModelNode = {
    id: 'test',
    label: 'example node',
    attributes: {},
  }
  return <NodeViewer open node={node} />
}

export const NoNode: React.FC = () => <NodeViewer open />

it('renders light with attributes', () => {
  const { asFragment } = renderLight(<WithAttributes />)
  expect(asFragment()).toBeDefined()
})

it('renders dark with no attributes', () => {
  const { asFragment } = renderDark(<NoAttributes />)
  expect(asFragment()).toBeDefined()
})
it('renders with no node', () => {
  const { asFragment } = renderDark(<NoNode />)
  expect(asFragment()).toBeDefined()
})
