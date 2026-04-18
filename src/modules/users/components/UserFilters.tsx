import { useId } from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import type { UserFilters as UserFiltersType } from '@/modules/users/domain/UserFilters'
import type { UserRole, UserStatus } from '@/modules/users/domain/User'
import { userRoles, userStatuses } from '@/modules/users/domain/User'
import { formatRole, formatStatus } from '@/modules/users/formatters'
import { UserSearchInput } from './UserSearchInput'

const ALL = '__ALL__'

interface UserFiltersProps {
  value: UserFiltersType
  onChange: (patch: Partial<UserFiltersType>) => void
  onReset?: () => void
  searchDebounceMs?: number
}

export function UserFilters({
  value,
  onChange,
  onReset,
  searchDebounceMs = 400,
}: UserFiltersProps) {
  const statusId = useId()
  const roleId = useId()

  const currentStatus = value.status[0] ?? ALL
  const currentRole = value.role[0] ?? ALL

  const hasAnyFilter = value.search.length > 0 || value.status.length > 0 || value.role.length > 0

  return (
    <div
      role="search"
      aria-label="Filtros de usuários"
      className="flex flex-col gap-4 md:flex-row md:items-end"
    >
      <div className="min-w-[260px] flex-1">
        <UserSearchInput
          value={value.search}
          onDebouncedChange={(search) => onChange({ search, page: 1 })}
          debounceMs={searchDebounceMs}
        />
      </div>

      <div className="flex flex-col gap-1.5 md:w-[180px]">
        <Label htmlFor={statusId}>Status</Label>
        <Select
          value={currentStatus}
          onValueChange={(v) =>
            onChange({
              status: v === ALL ? [] : [v as UserStatus],
              page: 1,
            })
          }
        >
          <SelectTrigger id={statusId} aria-label="Filtrar por status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos</SelectItem>
            {userStatuses.map((s) => (
              <SelectItem key={s} value={s}>
                {formatStatus(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5 md:w-[180px]">
        <Label htmlFor={roleId}>Perfil</Label>
        <Select
          value={currentRole}
          onValueChange={(v) =>
            onChange({
              role: v === ALL ? [] : [v as UserRole],
              page: 1,
            })
          }
        >
          <SelectTrigger id={roleId} aria-label="Filtrar por perfil">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos</SelectItem>
            {userRoles.map((r) => (
              <SelectItem key={r} value={r}>
                {formatRole(r)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {onReset ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={!hasAnyFilter}
          aria-label="Limpar filtros"
        >
          <X aria-hidden="true" />
          Limpar
        </Button>
      ) : null}
    </div>
  )
}
