import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge'

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'active', 'pending', 'inactive'],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Active: Story = {
  args: { variant: 'active', children: 'Ativo' },
}

export const Pending: Story = {
  args: { variant: 'pending', children: 'Pendente' },
}

export const Inactive: Story = {
  args: { variant: 'inactive', children: 'Inativo' },
}

export const AllStatus: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="active">Ativo</Badge>
      <Badge variant="pending">Pendente</Badge>
      <Badge variant="inactive">Inativo</Badge>
    </div>
  ),
  args: { children: '' },
}
