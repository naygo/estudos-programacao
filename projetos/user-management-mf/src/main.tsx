import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { UserManagementApp } from '@/UserManagementApp'
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
      <UserManagementApp apiBaseUrl="/api" />
    </StrictMode>,
  )
}

void bootstrap()
