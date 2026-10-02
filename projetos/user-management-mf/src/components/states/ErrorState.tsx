import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DisplayableError {
  code: string
  message: string
  status?: number
}

interface ErrorStateProps {
  error: DisplayableError
  onRetry?: () => void
  isRetrying?: boolean
  title?: string
}

export function ErrorState({
  error,
  onRetry,
  isRetrying = false,
  title = 'Não foi possível carregar',
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      data-testid="error-state"
      className="flex flex-col items-center justify-center gap-3 py-16 text-center"
    >
      <div className="rounded-full bg-destructive/10 p-3 text-destructive">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">{error.message}</p>
      </div>
      {onRetry ? (
        <Button onClick={onRetry} disabled={isRetrying} size="sm" variant="outline">
          <RefreshCw className={isRetrying ? 'animate-spin' : undefined} aria-hidden="true" />
          {isRetrying ? 'Tentando…' : 'Tentar novamente'}
        </Button>
      ) : null}
    </div>
  )
}
