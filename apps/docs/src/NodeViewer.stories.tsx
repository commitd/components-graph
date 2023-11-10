import { cytoscapeRenderer, Graph, NodeViewer } from '@committed/components-graph'
import { Button } from '@committed/ds'
import { Generator, ModelNode } from '@committed/graph'
import { useBoolean } from '@committed/hooks'
import { Meta, Story } from '@storybook/react'
import faker from 'faker'
import React, { useState } from 'react'

export default {
  title: 'Components/NodeViewer',
  component: NodeViewer,
} as Meta

export const Default: Story<React.ComponentProps<typeof NodeViewer>> = () => {
  const [model, setModel] = useState(Generator.randomGraph)

  const [node, setNode] = useState<ModelNode | undefined>(
    Object.values(model.getCurrentContent().nodes)[0]
  )
  const graph = (
    <Graph
      model={model}
      onModelChange={setModel}
      renderer={cytoscapeRenderer}
      options={{ height: 600 }}
      onViewNode={setNode}
    />
  )
  return (
    <>
      <NodeViewer
        open={node != null}
        node={node}
        onOpenChange={() => setNode(undefined)}
      />
      {graph}
    </>
  )
}

export const WithAttributes: Story = () => {
  const [open, { setTrue: setOpen, setFalse: setClosed }] = useBoolean(false)
  const node: ModelNode = {
    id: 'test',
    label: 'example node',
    attributes: {
      employer: 'Committed',
    },
  }
  return (
    <>
      <Button onClick={setOpen}>Open</Button>
      <NodeViewer open={open} node={node} onOpenChange={setClosed} />
    </>
  )
}

export const NoAttributes: Story = () => {
  const [open, { setTrue: setOpen, setFalse: setClosed }] = useBoolean(false)
  const node: ModelNode = {
    id: 'test',
    label: 'example node',
    attributes: {},
  }
  return (
    <>
      <Button onClick={setOpen}>Open</Button>
      <NodeViewer open={open} node={node} onOpenChange={setClosed} />
    </>
  )
}

export const NoNode: Story = () => {
  const [open, { setTrue: setOpen, setFalse: setClosed }] = useBoolean(false)
  return (
    <>
      <Button onClick={setOpen}>Open</Button>
      <NodeViewer open={open} onOpenChange={setClosed} />
    </>
  )
}

export const ManyAttributes: Story = () => {
  const [open, { setTrue: setOpen, setFalse: setClosed }] = useBoolean(false)
  const node: ModelNode = {
    id: 'test',
    label: 'example node',
    attributes: {
      firstName: faker.name.firstName(),
      middleName: faker.name.middleName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber(),
      url: faker.internet.url(),
      mac: faker.internet.mac(),
      zipCode: faker.address.zipCode(),
      city: faker.address.city(),
      cityPrefix: faker.address.cityPrefix(),
      citySuffix: faker.address.citySuffix(),
      cityName: faker.address.cityName(),
      streetName: faker.address.streetName(),
      vehicleVIN: faker.vehicle.vin(),
      vehicleMake: faker.vehicle.manufacturer(),
      vehicleModel: faker.vehicle.model(),
    },
  }
  return (
    <>
      <Button onClick={setOpen}>Open</Button>
      <NodeViewer
        open={open}
        node={node}
        onOpenChange={setClosed}
        defaultClose={false}
      />
    </>
  )
}
