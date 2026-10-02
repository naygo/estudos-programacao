import type { UserRole, UserStatus } from './User'

export interface UserFilters {
  search: string
  status: UserStatus[]
  role: UserRole[]
  page: number
  pageSize: number
}

export const defaultUserFilters: UserFilters = {
  search: '',
  status: [],
  role: [],
  page: 1,
  pageSize: 20,
}

export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100
