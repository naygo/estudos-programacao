import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/globals.css'

async function enableMocking() {
  const { worker } = await import('@/modules/users/mocks/browser')
  return worker.start({ onUnhandledRequest: 'bypass' })
}

async function bootstrap() {
  if (import.meta.env.DEV) {
    await enableMocking()
  }

  const rootEl = document.getElementById('root')
  if (!rootEl) throw new Error('#root not found')

  createRoot(rootEl).render(
    <StrictMode>
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-primary">user-management-mf</h1>
        <p className="mt-2 text-muted-foreground">
          MSW ativo — próximo: datasource + controllers
        </p>
      </div>
    </StrictMode>,
  )
}

void bootstrap()
