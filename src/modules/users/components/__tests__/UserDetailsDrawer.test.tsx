import { describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserDetailsDrawer } from '../UserDetailsDrawer'
import { fixtureUsers } from '@/modules/users/mocks/fixtures'
import { renderWithProviders } from '@/test/renderWithProviders'

const user = fixtureUsers[0]!

describe('UserDetailsDrawer (a11y)', () => {
  it('renderiza título + descrição como dialog', () => {
    renderWithProviders(<UserDetailsDrawer open user={user} onOpenChange={vi.fn()} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /detalhes do usuário/i })).toBeInTheDocument()
  })

  it('mostra todos os campos do usuário carregado', () => {
    renderWithProviders(<UserDetailsDrawer open user={user} onOpenChange={vi.fn()} />)
    expect(screen.getByText(user.name)).toBeInTheDocument()
    expect(screen.getByText(user.email)).toBeInTheDocument()
    expect(screen.getByText(user.cpf)).toBeInTheDocument()
    expect(screen.getByText(user.department)).toBeInTheDocument()
  })

  it('fallback "Nunca acessou" quando lastLogin null', () => {
    renderWithProviders(
      <UserDetailsDrawer
        open
        user={{ ...user, status: 'pending', lastLogin: null }}
        onOpenChange={vi.fn()}
      />,
    )
    expect(screen.getByText(/nunca acessou/i)).toBeInTheDocument()
  })

  it('ESC fecha drawer (chama onOpenChange(false))', async () => {
    const onOpenChange = vi.fn()
    renderWithProviders(<UserDetailsDrawer open user={user} onOpenChange={onOpenChange} />)
    await userEvent.setup().keyboard('{Escape}')
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
  })

  it('botão fechar (X) chama onOpenChange(false)', async () => {
    const onOpenChange = vi.fn()
    renderWithProviders(<UserDetailsDrawer open user={user} onOpenChange={onOpenChange} />)
    const closeBtn = screen.getByRole('button', { name: /fechar/i })
    await userEvent.setup().click(closeBtn)
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
  })

  it('renderiza estado de loading (skeleton)', () => {
    renderWithProviders(<UserDetailsDrawer open user={null} isLoading onOpenChange={vi.fn()} />)
    expect(screen.getByTestId('user-details-loading')).toBeInTheDocument()
  })

  it('renderiza error state com retry', async () => {
    const onRetry = vi.fn()
    renderWithProviders(
      <UserDetailsDrawer
        open
        user={null}
        error={{ code: 'USER_NOT_FOUND', message: 'Usuário removido' }}
        onRetry={onRetry}
        onOpenChange={vi.fn()}
      />,
    )
    expect(screen.getByTestId('error-state')).toBeInTheDocument()
    await userEvent.setup().click(screen.getByRole('button', { name: /tentar novamente/i }))
    expect(onRetry).toHaveBeenCalled()
  })

  it('não vaza estado quando fechado', () => {
    renderWithProviders(<UserDetailsDrawer open={false} user={user} onOpenChange={vi.fn()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
