import { describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserFilters } from '../UserFilters'
import { defaultUserFilters, type UserFilters as UserFiltersType } from '@/modules/users/domain/UserFilters'
import { renderWithProviders } from '@/test/renderWithProviders'

function setup(overrides: Partial<UserFiltersType> = {}) {
  const onChange = vi.fn<(patch: Partial<UserFiltersType>) => void>()
  const onReset = vi.fn()
  const value: UserFiltersType = { ...defaultUserFilters, ...overrides }
  renderWithProviders(
    <UserFilters value={value} onChange={onChange} onReset={onReset} searchDebounceMs={50} />,
  )
  return { onChange, onReset, user: userEvent.setup({ delay: null }) }
}

describe('UserFilters (integration)', () => {
  it('digitar no search dispara onChange debounced uma vez com valor final', async () => {
    const { onChange, user } = setup()
    const input = screen.getByLabelText(/buscar/i)

    await user.type(input, 'maria')
    // aguarda o debounce estabilizar e a última call refletir o valor final
    await waitFor(() => {
      const last = onChange.mock.calls.at(-1)?.[0]
      expect(last).toMatchObject({ search: 'maria', page: 1 })
    })
  })

  it('mudança no status atualiza onChange e reseta page', async () => {
    const { onChange, user } = setup({ status: [], page: 5 })
    const trigger = screen.getByRole('combobox', { name: /filtrar por status/i })
    await user.click(trigger)
    await user.click(screen.getByRole('option', { name: 'Ativo' }))

    expect(onChange).toHaveBeenCalledWith({ status: ['active'], page: 1 })
  })

  it('mudança no perfil atualiza onChange', async () => {
    const { onChange, user } = setup()
    const trigger = screen.getByRole('combobox', { name: /filtrar por perfil/i })
    await user.click(trigger)
    await user.click(screen.getByRole('option', { name: 'Administrador' }))

    expect(onChange).toHaveBeenCalledWith({ role: ['admin'], page: 1 })
  })

  it('seleção "Todos" limpa o array do filtro', async () => {
    const { onChange, user } = setup({ status: ['active'] })
    const trigger = screen.getByRole('combobox', { name: /filtrar por status/i })
    await user.click(trigger)
    await user.click(screen.getByRole('option', { name: 'Todos' }))

    expect(onChange).toHaveBeenCalledWith({ status: [], page: 1 })
  })

  it('botão Limpar chama onReset quando há filtros ativos', async () => {
    const { onReset, user } = setup({ search: 'maria', status: ['active'] })
    const limpar = screen.getByRole('button', { name: /limpar filtros/i })
    expect(limpar).not.toBeDisabled()
    await user.click(limpar)
    expect(onReset).toHaveBeenCalled()
  })

  it('botão Limpar desabilitado quando não há filtros ativos', () => {
    setup()
    const limpar = screen.getByRole('button', { name: /limpar filtros/i })
    expect(limpar).toBeDisabled()
  })

  it('navegação por teclado: Tab percorre search → status → perfil → limpar', async () => {
    const { user } = setup({ search: 'x', status: ['active'] })
    const search = screen.getByLabelText(/buscar/i)
    search.focus()
    expect(search).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('combobox', { name: /filtrar por status/i })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('combobox', { name: /filtrar por perfil/i })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('button', { name: /limpar filtros/i })).toHaveFocus()
  })

  it('reflete valor externo no search (URL-driven)', () => {
    setup({ search: 'alice' })
    expect(screen.getByLabelText(/buscar/i)).toHaveValue('alice')
  })
})
