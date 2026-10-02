import { TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/shared/lib/utils'
import { formatDate } from '@/shared/lib/formatters'
import type { User } from '@/modules/users/domain/User'
import { StatusBadge } from './StatusBadge'
import { formatRole } from '@/modules/users/formatters'

interface UserTableRowProps {
  user: User
  isSelected?: boolean
  onSelect?: (user: User) => void
}

export function UserTableRow({ user, isSelected = false, onSelect }: UserTableRowProps) {
  return (
    <TableRow
      data-state={isSelected ? 'selected' : undefined}
      onClick={() => onSelect?.(user)}
      className={cn(
        'cursor-pointer',
        isSelected && 'border-l-[3px] border-l-primary bg-accent/40',
      )}
    >
      <TableCell className="font-medium">
        <button
          type="button"
          className="rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={`Ver detalhes de ${user.name}`}
        >
          {user.name}
        </button>
      </TableCell>
      <TableCell className="text-muted-foreground">{user.email}</TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground">{user.cpf}</TableCell>
      <TableCell>{formatRole(user.role)}</TableCell>
      <TableCell>
        <StatusBadge status={user.status} />
      </TableCell>
      <TableCell className="text-muted-foreground">{user.department}</TableCell>
      <TableCell className="text-muted-foreground">{formatDate(user.lastLogin)}</TableCell>
    </TableRow>
  )
}
