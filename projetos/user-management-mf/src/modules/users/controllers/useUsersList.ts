import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useUserService } from './servicesContext'
import type { UserFilters } from '@/modules/users/domain/UserFilters'
import type { User, UserListResponse, Pagination } from '@/modules/users/domain/User'
import type { ApiError } from '@/shared/domain/ApiError'

export interface UseUsersListReturn {
  users: User[]
  pagination: Pagination | null
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  error: ApiError | null
  refetch: () => void
}

export function useUsersListQueryKey(filters: UserFilters) {
  return ['users', 'list', filters] as const
}

export function useUsersList(filters: UserFilters): UseUsersListReturn {
  const service = useUserService()

  const query = useQuery<UserListResponse, ApiError>({
    queryKey: useUsersListQueryKey(filters),
    queryFn: async () => {
      const result = await service.list(filters)
      if (!result.ok) throw result.error
      return result.data
    },
    placeholderData: keepPreviousData,
    retry: false, // retry vive no httpClient (ADR-003)
    staleTime: 30_000,
  })

  return {
    users: query.data?.data ?? [],
    pagination: query.data?.pagination ?? null,
    isLoading: query.isPending && !query.data,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error ?? null,
    refetch: () => {
      void query.refetch()
    },
  }
}
