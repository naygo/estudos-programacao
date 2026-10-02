import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { ErrorState } from './ErrorState'

const meta = {
  title: 'States/ErrorState',
  component: ErrorState,
  tags: ['autodocs'],
  args: {
    onRetry: fn(),
  },
} satisfies Meta<typeof ErrorState>

export default meta
type Story = StoryObj<typeof meta>

export const Transient5xx: Story = {
  args: {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Erro temporário no servidor. Tente novamente em instantes.',
      status: 503,
    },
  },
}

export const NonRetryable4xx: Story = {
  args: {
    error: {
      code: 'INVALID_FILTER',
      message: 'Filtro inválido: role desconhecida.',
      status: 400,
    },
    onRetry: undefined,
  },
}

export const NetworkError: Story = {
  args: {
    error: {
      code: 'NETWORK_ERROR',
      message: 'Sem conexão com o servidor.',
    },
  },
}

export const Retrying: Story = {
  args: {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Erro temporário no servidor.',
      status: 503,
    },
    isRetrying: true,
  },
}
