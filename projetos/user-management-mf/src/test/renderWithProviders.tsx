import type { ReactNode } from 'react'
import { render, renderHook, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NuqsTestingAdapter, type UrlUpdateEvent } from 'nuqs/adapters/testing'
import { ServicesProvider } from '@/modules/users/controllers/servicesContext'
import { createHttpClient } from '@/modules/users/datasource/httpClient'
import { createUserDatasource } from '@/modules/users/datasource/userDatasource'
import { createUserService, type UserService } from '@/modules/users/services/userService'

export function buildTestUserService(): UserService {
  const http = createHttpClient({
    baseUrl: '/api',
    retry: { sleep: () => Promise.resolve(), jitter: () => 0 },
  })
  const ds = createUserDatasource(http)
  return createUserService(ds)
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  })
}

interface ProvidersProps {
  children: ReactNode
  userService?: UserService
  searchParams?: string
  onUrlUpdate?: (e: UrlUpdateEvent) => void
}

export function TestProviders({
  children,
  userService = buildTestUserService(),
  searchParams,
  onUrlUpdate,
}: ProvidersProps) {
  return (
    <QueryClientProvider client={makeQueryClient()}>
      <NuqsTestingAdapter searchParams={searchParams} onUrlUpdate={onUrlUpdate}>
        <ServicesProvider userService={userService}>{children}</ServicesProvider>
      </NuqsTestingAdapter>
    </QueryClientProvider>
  )
}

export function renderWithProviders(
  ui: ReactNode,
  opts: Omit<ProvidersProps, 'children'> & Omit<RenderOptions, 'wrapper'> = {},
) {
  const { userService, searchParams, onUrlUpdate, ...rest } = opts
  return render(ui, {
    wrapper: ({ children }) => (
      <TestProviders
        userService={userService}
        searchParams={searchParams}
        onUrlUpdate={onUrlUpdate}
      >
        {children}
      </TestProviders>
    ),
    ...rest,
  })
}

export function renderHookWithProviders<T>(
  hook: () => T,
  opts: Omit<ProvidersProps, 'children'> = {},
) {
  const { userService, searchParams, onUrlUpdate } = opts
  return renderHook(hook, {
    wrapper: ({ children }) => (
      <TestProviders
        userService={userService}
        searchParams={searchParams}
        onUrlUpdate={onUrlUpdate}
      >
        {children}
      </TestProviders>
    ),
  })
}
