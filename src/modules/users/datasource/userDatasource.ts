import type { HttpClient } from './httpClient'
import type { ApiError, Result } from '@/shared/domain/ApiError'
import type { UserFilters } from '@/modules/users/domain/UserFilters'

export interface UserDatasource {
  list(filters: UserFilters): Promise<Result<unknown, ApiError>>
  getById(id: string): Promise<Result<unknown, ApiError>>
}

export function createUserDatasource(http: HttpClient): UserDatasource {
  return {
    list(filters) {
      const params = new URLSearchParams()
      params.set('page', String(filters.page))
      params.set('pageSize', String(filters.pageSize))
      if (filters.search.length > 0) params.set('search', filters.search)
      for (const status of filters.status) params.append('status', status)
      for (const role of filters.role) params.append('role', role)
      return http.request(`/users?${params.toString()}`)
    },

    getById(id) {
      return http.request(`/users/${encodeURIComponent(id)}`)
    },
  }
}
