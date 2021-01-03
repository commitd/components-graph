import { Flex } from '@committed/components'
import React, { useState } from 'react'
import { GraphToolbar } from '.'
import { addRandomEdge, addRandomNode } from '../../graph/data/Generator'
import { GraphModel } from '../../graph/GraphModel'
import { renderDark, renderLight, userEvent } from '../../setupTests'

const Template: React.FC<{ flexDirection: 'row' | 'column' }> = ({
  flexDirection,
}) => {
  const [model, setModel] = useState(
    addRandomEdge(addRandomNode(GraphModel.createEmpty(), 20), 15)
  )
  return (
    <Flex flexDirection={flexDirection === 'row' ? 'column' : 'row'}>
      <GraphToolbar
        flexDirection={flexDirection}
        model={model}
        onModelChange={setModel}
      />
    </Flex>
  )
}

export const Vertical: React.FC = () => {
  return <Template flexDirection="column" />
}

export const Horizontal: React.FC = () => {
  return <Template flexDirection="row" />
}

it('renders light', () => {
  const { asFragment } = renderLight(<Horizontal />)
  expect(asFragment()).toMatchSnapshot()
})

it('renders dark', () => {
  const { asFragment } = renderDark(<Horizontal />)
  expect(asFragment()).toMatchSnapshot()
})

test.each([
  [/zoom-in/i, 'ZoomIn'],
  [/zoom-out/i, 'ZoomOut'],
  [/layout/i, 'Layout'],
  [/refit/i, 'Refit'],
])('button label %s issues command %s', (pattern, command) => {
  const onChange = jest.fn()
  const { getByRole } = renderLight(
    <GraphToolbar
      flexDirection="row"
      model={GraphModel.createEmpty()}
      onModelChange={onChange}
    />
  )

  userEvent.click(getByRole('button', { name: pattern }))
  const newModel = onChange.mock.calls[0][0] as GraphModel
  expect(newModel.getCommands()[0]).toEqual({ type: command })
})
