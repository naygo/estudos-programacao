import { Badge } from '@/components/ui/badge'
import type { UserStatus } from '@/modules/users/domain/User'
import { formatStatus } from '@/modules/users/formatters'

const statusVariant: Record<UserStatus, 'active' | 'inactive' | 'pending'> = {
  active: 'active',
  inactive: 'inactive',
  pending: 'pending',
}

interface StatusBadgeProps {
  status: UserStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge variant={statusVariant[status]}>{formatStatus(status)}</Badge>
}
