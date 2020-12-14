import React from 'react'
import { Story, Meta } from '@storybook/react'
import { useExample } from '.'

export interface UseExampleDocsProps {}

/**
 * useExample hook ...
 */
export const UseExampleDocs = () => null

export default {
  title: 'Hooks/useExample',
  component: UseExampleDocs,
  excludeStories: ['UseExampleDocs'],
} as Meta

const Template: Story<UseExampleDocsProps> = ({}) => {
  const value = useExample()
  return <div>{JSON.stringify(value)}</div>
}

export const Default = Template.bind({})
Default.args = {}
