import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/states/ErrorState'
import { formatDateTime } from '@/shared/lib/formatters'
import type { User } from '@/modules/users/domain/User'
import { formatRole } from '@/modules/users/formatters'
import { StatusBadge } from './StatusBadge'

interface UserDetailsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  isLoading?: boolean
  error?: { code: string; message: string } | null
  onRetry?: () => void
}

export function UserDetailsDrawer({
  open,
  onOpenChange,
  user,
  isLoading = false,
  error,
  onRetry,
}: UserDetailsDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-md sm:max-w-md"
        data-testid="user-details-drawer"
        aria-describedby={undefined}
      >
        <SheetHeader>
          <SheetTitle>Detalhes do usuário</SheetTitle>
          <SheetDescription>
            Informações completas, perfil e histórico de acesso.
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        {isLoading ? <LoadingBody /> : null}
        {!isLoading && error ? (
          <ErrorState error={error} onRetry={onRetry} title="Falha ao carregar detalhes" />
        ) : null}
        {!isLoading && !error && user ? <LoadedBody user={user} /> : null}
        {!isLoading && !error && !user ? (
          <p className="text-sm text-muted-foreground">Selecione um usuário para ver os detalhes.</p>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function LoadingBody() {
  return (
    <div className="flex flex-col gap-4" data-testid="user-details-loading">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-24" />
      <Separator />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  )
}

function LoadedBody({ user }: { user: User }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold leading-tight">{user.name}</h3>
          <p className="font-mono text-xs text-muted-foreground">{user.id}</p>
        </div>
        <StatusBadge status={user.status} />
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
        <Field label="E-mail" value={user.email} />
        <Field label="CPF" value={user.cpf} mono />
        <Field label="Perfil" value={formatRole(user.role)} />
        <Field label="Departamento" value={user.department} />
        <Field label="Criado em" value={formatDateTime(user.createdAt)} />
        <Field label="Último acesso" value={formatDateTime(user.lastLogin, 'Nunca acessou')} />
      </dl>
    </div>
  )
}

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={mono ? 'font-mono text-xs' : undefined}>{value}</dd>
    </>
  )
}
