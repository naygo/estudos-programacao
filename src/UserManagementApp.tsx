import { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { ServicesProvider } from '@/modules/users/controllers/servicesContext'
import { createHttpClient } from '@/modules/users/datasource/httpClient'
import { createUserDatasource } from '@/modules/users/datasource/userDatasource'
import { createUserService } from '@/modules/users/services/userService'
import { UserListPage } from '@/modules/users/components/UserListPage'
import type { User } from '@/modules/users/domain/User'
import type { ApiError } from '@/shared/domain/ApiError'

export interface UserManagementAppProps {
  apiBaseUrl?: string
  authToken?: string | (() => string | Promise<string>)
  queryClient?: QueryClient
  onUserSelected?: (user: User) => void
  onError?: (error: ApiError) => void
  className?: string
}

function buildServices(apiBaseUrl: string, authToken: UserManagementAppProps['authToken']) {
  const http = createHttpClient({
    baseUrl: apiBaseUrl,
    getAuthToken: authToken
      ? () => (typeof authToken === 'function' ? authToken() : authToken)
      : undefined,
  })
  const datasource = createUserDatasource(http)
  return createUserService(datasource)
}

function buildQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 30_000,
      },
    },
  })
}

export function UserManagementApp({
  apiBaseUrl = '/api',
  authToken,
  queryClient,
  onUserSelected,
  className,
}: UserManagementAppProps) {
  const userService = useMemo(
    () => buildServices(apiBaseUrl, authToken),
    [apiBaseUrl, authToken],
  )
  const client = useMemo(() => queryClient ?? buildQueryClient(), [queryClient])

  return (
    <QueryClientProvider client={client}>
      <NuqsAdapter>
        <ServicesProvider userService={userService}>
          <div className={className ?? 'mx-auto max-w-7xl p-6'}>
            <UserListPage onUserSelected={onUserSelected} />
          </div>
        </ServicesProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  )
}
