import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableRowsSkeleton } from '@/components/states/TableRowsSkeleton'
import { EmptyState } from '@/components/states/EmptyState'
import { UserX } from 'lucide-react'
import type { User } from '@/modules/users/domain/User'
import { UserTableRow } from './UserTableRow'

const COLUMNS = ['Nome', 'Email', 'CPF', 'Perfil', 'Status', 'Departamento', 'Último acesso']

interface UserTableProps {
  users: User[]
  isLoading?: boolean
  selectedUserId?: string | null
  onSelectUser?: (user: User) => void
}

export function UserTable({ users, isLoading = false, selectedUserId, onSelectUser }: UserTableProps) {
  const showEmpty = !isLoading && users.length === 0

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {COLUMNS.map((col) => (
            <TableHead key={col} scope="col">
              {col}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? <TableRowsSkeleton rows={8} columns={COLUMNS.length} /> : null}
        {!isLoading
          ? users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                isSelected={selectedUserId === user.id}
                onSelect={onSelectUser}
              />
            ))
          : null}
        {showEmpty ? (
          <TableRow>
            <TableCell colSpan={COLUMNS.length} className="p-0">
              <EmptyState
                icon={UserX}
                title="Nenhum usuário encontrado"
                description="Ajuste os filtros ou limpe a busca para ver mais resultados."
              />
            </TableCell>
          </TableRow>
        ) : null}
      </TableBody>
    </Table>
  )
}
