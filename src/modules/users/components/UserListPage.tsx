import { useCallback } from 'react'
import { ErrorState } from '@/components/states/ErrorState'
import { useUsersList } from '@/modules/users/controllers/useUsersList'
import { useUserDetails } from '@/modules/users/controllers/useUserDetails'
import { useUserFilters } from '@/modules/users/controllers/useUserFilters'
import type { User } from '@/modules/users/domain/User'
import { UserFilters } from './UserFilters'
import { UserTable } from './UserTable'
import { Pagination } from './Pagination'
import { UserDetailsDrawer } from './UserDetailsDrawer'

export interface UserListPageProps {
  onUserSelected?: (user: User) => void
}

export function UserListPage({ onUserSelected }: UserListPageProps) {
  const { filters, selectedUserId, setFilters, setSelectedUserId, reset } = useUserFilters()
  const list = useUsersList(filters)
  const details = useUserDetails(selectedUserId)

  const handleSelectUser = useCallback(
    (user: User) => {
      setSelectedUserId(user.id)
      onUserSelected?.(user)
    },
    [setSelectedUserId, onUserSelected],
  )

  const handleCloseDrawer = useCallback(
    (open: boolean) => {
      if (!open) setSelectedUserId(null)
    },
    [setSelectedUserId],
  )

  const { users, pagination, isLoading, isFetching, isError, error, refetch } = list

  const announcement = buildAnnouncement({ isLoading, isError, error, total: pagination?.total })

  return (
    <section aria-labelledby="users-heading" className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Localiza</p>
        <h1 id="users-heading" className="text-2xl font-semibold tracking-tight">
          Gestão de Usuários
        </h1>
        <p className="text-sm text-muted-foreground">
          Liste, filtre e inspecione usuários do backoffice.
        </p>
      </header>

      <UserFilters value={filters} onChange={setFilters} onReset={reset} />

      <div className="sr-only" role="status" aria-live="polite" data-testid="list-announcer">
        {announcement}
      </div>

      {isError && error ? (
        <ErrorState error={error} onRetry={refetch} isRetrying={isFetching} />
      ) : (
        <>
          <div className="rounded-md border bg-card">
            <UserTable
              users={users}
              isLoading={isLoading}
              selectedUserId={selectedUserId}
              onSelectUser={handleSelectUser}
            />
          </div>

          {pagination ? (
            <Pagination
              page={pagination.page}
              pageSize={pagination.pageSize}
              total={pagination.total}
              totalPages={pagination.totalPages}
              onPageChange={(page) => setFilters({ page })}
              onPageSizeChange={(pageSize) => setFilters({ pageSize, page: 1 })}
            />
          ) : null}
        </>
      )}

      <UserDetailsDrawer
        open={selectedUserId !== null}
        onOpenChange={handleCloseDrawer}
        user={details.user}
        isLoading={details.isLoading}
        error={details.error}
        onRetry={details.refetch}
      />
    </section>
  )
}

function buildAnnouncement({
  isLoading,
  isError,
  error,
  total,
}: {
  isLoading: boolean
  isError: boolean
  error: { code: string; message: string } | null
  total: number | undefined
}): string {
  if (isLoading) return 'Carregando usuários…'
  if (isError && error) return `Erro ao carregar: ${error.message}`
  if (typeof total === 'number') {
    if (total === 0) return 'Nenhum usuário encontrado.'
    return `${total.toLocaleString('pt-BR')} usuários encontrados.`
  }
  return ''
}
