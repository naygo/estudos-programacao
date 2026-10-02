import type { Meta, StoryObj } from '@storybook/react'
import { UserX } from 'lucide-react'
import { EmptyState } from './EmptyState'
import { Button } from '@/components/ui/button'

const meta = {
  title: 'States/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const UsersModuleVariant: Story = {
  args: {
    icon: UserX,
    title: 'Nenhum usuário encontrado',
    description: 'Ajuste os filtros ou limpe a busca para ver mais resultados.',
  },
}

export const WithAction: Story = {
  args: {
    action: <Button size="sm">Limpar filtros</Button>,
  },
}
