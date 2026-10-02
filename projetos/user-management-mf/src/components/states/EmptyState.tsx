import { Inbox, type LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: LucideIcon
  action?: React.ReactNode
}

export function EmptyState({
  title = 'Nenhum resultado encontrado',
  description = 'Ajuste os filtros ou limpe a busca para ver mais resultados.',
  icon: Icon = Inbox,
  action,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      data-testid="empty-state"
      className="flex flex-col items-center justify-center gap-2 py-16 text-center"
    >
      <div className="rounded-full bg-muted p-3 text-muted-foreground">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
