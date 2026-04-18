import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { fn } from '@storybook/test'
import { UserSearchInput } from './UserSearchInput'

const meta = {
  title: 'Users/UserSearchInput',
  component: UserSearchInput,
  tags: ['autodocs'],
  args: {
    value: '',
    onDebouncedChange: fn(),
  },
} satisfies Meta<typeof UserSearchInput>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}

export const Prefilled: Story = {
  args: { value: 'maria' },
}

function InteractiveSearch(args: React.ComponentProps<typeof UserSearchInput>) {
  const [val, setVal] = useState(args.value)
  return (
    <div className="flex flex-col gap-3">
      <UserSearchInput {...args} value={val} onDebouncedChange={setVal} />
      <p className="text-xs text-muted-foreground">Valor após debounce: {val || '(vazio)'}</p>
    </div>
  )
}

export const Interactive: Story = {
  render: (args) => <InteractiveSearch {...args} />,
}
