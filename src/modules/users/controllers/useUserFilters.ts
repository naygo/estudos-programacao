import { useCallback, useMemo } from 'react'
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs'
import { userRoles, userStatuses } from '@/modules/users/domain/User'
import {
  DEFAULT_PAGE_SIZE,
  defaultUserFilters,
  type UserFilters,
} from '@/modules/users/domain/UserFilters'

const statusParser = parseAsArrayOf(parseAsStringLiteral(userStatuses)).withDefault([])
const roleParser = parseAsArrayOf(parseAsStringLiteral(userRoles)).withDefault([])
const searchParser = parseAsString.withDefault('')
const pageParser = parseAsInteger.withDefault(1)
const pageSizeParser = parseAsInteger.withDefault(DEFAULT_PAGE_SIZE)
const userIdParser = parseAsString.withDefault('')

const parsers = {
  search: searchParser,
  status: statusParser,
  role: roleParser,
  page: pageParser,
  pageSize: pageSizeParser,
  userId: userIdParser,
}

export interface UseUserFiltersReturn {
  filters: UserFilters
  selectedUserId: string | null
  setFilters: (patch: Partial<UserFilters>) => void
  setSelectedUserId: (id: string | null) => void
  reset: () => void
}

export function useUserFilters(): UseUserFiltersReturn {
  const [state, setState] = useQueryStates(parsers, { history: 'replace' })

  const filters = useMemo<UserFilters>(
    () => ({
      search: state.search,
      status: state.status,
      role: state.role,
      page: state.page,
      pageSize: state.pageSize,
    }),
    [state.search, state.status, state.role, state.page, state.pageSize],
  )

  const selectedUserId = state.userId.length > 0 ? state.userId : null

  const setFilters = useCallback(
    (patch: Partial<UserFilters>) => {
      setState(patch)
    },
    [setState],
  )

  const setSelectedUserId = useCallback(
    (id: string | null) => {
      setState({ userId: id ?? '' })
    },
    [setState],
  )

  const reset = useCallback(() => {
    setState({
      search: defaultUserFilters.search,
      status: defaultUserFilters.status,
      role: defaultUserFilters.role,
      page: defaultUserFilters.page,
    })
  }, [setState])

  return { filters, selectedUserId, setFilters, setSelectedUserId, reset }
}
