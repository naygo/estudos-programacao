import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { fn } from '@storybook/test'
import { UserFilters } from './UserFilters'
import { defaultUserFilters, type UserFilters as UserFiltersType } from '@/modules/users/domain/UserFilters'

const meta = {
  title: 'Users/UserFilters',
  component: UserFilters,
  tags: ['autodocs'],
  args: {
    value: defaultUserFilters,
    onChange: fn(),
    onReset: fn(),
  },
} satisfies Meta<typeof UserFilters>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithSearch: Story = {
  args: {
    value: { ...defaultUserFilters, search: 'maria' },
  },
}

export const WithStatusAndRole: Story = {
  args: {
    value: { ...defaultUserFilters, status: ['active'], role: ['admin'] },
  },
}

function InteractiveFilters(args: React.ComponentProps<typeof UserFilters>) {
  const [state, setState] = useState<UserFiltersType>(args.value)
  return (
    <UserFilters
      {...args}
      value={state}
      onChange={(patch) => setState((prev) => ({ ...prev, ...patch }))}
      onReset={() => setState(defaultUserFilters)}
    />
  )
}

export const Interactive: Story = {
  render: (args) => <InteractiveFilters {...args} />,
}
