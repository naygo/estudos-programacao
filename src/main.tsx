import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/globals.css'

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('#root not found')
}

createRoot(rootEl).render(
  <StrictMode>
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-primary">user-management-mf — scaffold OK</h1>
      <p className="mt-2 text-muted-foreground">next: shadcn + domain + components</p>
    </div>
  </StrictMode>,
)
