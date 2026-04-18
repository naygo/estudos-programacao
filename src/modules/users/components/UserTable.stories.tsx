import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { UserTable } from './UserTable'
import { fixtureUsers } from '@/modules/users/mocks/fixtures'

const meta = {
  title: 'Users/UserTable',
  component: UserTable,
  tags: ['autodocs'],
  args: {
    onSelectUser: fn(),
  },
} satisfies Meta<typeof UserTable>

export default meta
type Story = StoryObj<typeof meta>

export const Populated: Story = {
  args: {
    users: fixtureUsers.slice(0, 10),
  },
}

export const WithSelected: Story = {
  args: {
    users: fixtureUsers.slice(0, 10),
    selectedUserId: fixtureUsers[2]?.id ?? null,
  },
}

export const Loading: Story = {
  args: {
    users: [],
    isLoading: true,
  },
}

export const Empty: Story = {
  args: {
    users: [],
  },
}
