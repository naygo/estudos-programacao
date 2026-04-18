import { useQuery } from '@tanstack/react-query'
import { useUserService } from './servicesContext'
import type { User } from '@/modules/users/domain/User'
import type { ApiError } from '@/shared/domain/ApiError'

export interface UseUserDetailsReturn {
  user: User | null
  isLoading: boolean
  isError: boolean
  error: ApiError | null
  refetch: () => void
}

export function useUserDetails(id: string | null): UseUserDetailsReturn {
  const service = useUserService()

  const query = useQuery<User, ApiError>({
    queryKey: ['users', 'byId', id],
    queryFn: async () => {
      if (!id) throw new Error('id ausente')
      const result = await service.getById(id)
      if (!result.ok) throw result.error
      return result.data
    },
    enabled: Boolean(id),
    retry: false,
    staleTime: 30_000,
  })

  return {
    user: query.data ?? null,
    isLoading: query.isPending && query.fetchStatus !== 'idle',
    isError: query.isError,
    error: query.error ?? null,
    refetch: () => {
      void query.refetch()
    },
  }
}
