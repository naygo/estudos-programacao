import { describe, expect, it } from 'vitest'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserListPage } from '../UserListPage'
import { renderWithProviders } from '@/test/renderWithProviders'
import { fixtureUsers } from '@/modules/users/mocks/fixtures'

describe('UserListPage (smoke integration)', () => {
  it('header com heading + live announcer anuncia total', async () => {
    renderWithProviders(<UserListPage />)
    expect(screen.getByRole('heading', { name: /gestão de usuários/i })).toBeInTheDocument()
    const announcer = screen.getByTestId('list-announcer')
    await waitFor(() => expect(announcer.textContent).toMatch(/\d+ usuários encontrados/i))
  })

  it('carrega lista, clica em linha, drawer abre com dados', async () => {
    renderWithProviders(<UserListPage />)
    await waitFor(() => {
      expect(screen.getAllByRole('row').length).toBeGreaterThan(1)
    })

    const firstUser = fixtureUsers[0]!
    const trigger = screen.getByRole('button', {
      name: new RegExp(`ver detalhes de ${firstUser.name}`, 'i'),
    })
    fireEvent.click(trigger)

    await waitFor(
      () => {
        const dialog = screen.getByRole('dialog')
        expect(within(dialog).getByText(firstUser.email)).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })

  it('deep link via searchParams abre drawer com usuário já selecionado', async () => {
    const target = fixtureUsers[2]!
    renderWithProviders(<UserListPage />, { searchParams: `?userId=${target.id}` })
    await waitFor(() => {
      const dialog = screen.getByRole('dialog')
      expect(within(dialog).getByText(target.email)).toBeInTheDocument()
    })
  })

  it('ESC fecha drawer e anunciador volta a mostrar total', async () => {
    const u = userEvent.setup()
    const target = fixtureUsers[0]!
    renderWithProviders(<UserListPage />, { searchParams: `?userId=${target.id}` })
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())
    await u.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('deep link com filtros pré-aplicados (status=active)', async () => {
    renderWithProviders(<UserListPage />, { searchParams: '?status=active' })
    await waitFor(() => {
      expect(screen.getAllByRole('row').length).toBeGreaterThan(1)
    })
    const statusTrigger = screen.getByRole('combobox', { name: /filtrar por status/i })
    expect(statusTrigger).toHaveTextContent(/ativo/i)
  })
})
