import type { UserDatasource } from '@/modules/users/datasource/userDatasource'
import type { User, UserListResponse } from '@/modules/users/domain/User'
import type { UserFilters } from '@/modules/users/domain/UserFilters'
import type { ApiError, Result } from '@/shared/domain/ApiError'
import { mapUser, mapUserList } from './userMapper'

export interface UserService {
  list(filters: UserFilters): Promise<Result<UserListResponse, ApiError>>
  getById(id: string): Promise<Result<User, ApiError>>
}

export function createUserService(datasource: UserDatasource): UserService {
  return {
    async list(filters) {
      const raw = await datasource.list(filters)
      if (!raw.ok) return raw
      return mapUserList(raw.data)
    },

    async getById(id) {
      const raw = await datasource.getById(id)
      if (!raw.ok) return raw
      return mapUser(raw.data)
    },
  }
}
