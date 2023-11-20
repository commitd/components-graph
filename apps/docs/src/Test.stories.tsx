import { Text } from "@committed/ds"
import { Meta, StoryObj } from "@storybook/react"

export const HW = () =>  <Text css={{color: '$primary'}} weight="bold" italic>Hello world</Text>

export default {
    component: HW
} satisfies Meta<typeof HW>

export const Test1: StoryObj<typeof HW> = { 
}