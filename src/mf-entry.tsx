import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { UserManagementApp, type UserManagementAppProps } from '@/UserManagementApp'
export { UserManagementApp } from '@/UserManagementApp'
export type { UserManagementAppProps } from '@/UserManagementApp'
export type { User, UserRole, UserStatus } from '@/modules/users/domain/User'
export type { UserFilters } from '@/modules/users/domain/UserFilters'
export type { ApiError, ApiErrorCode } from '@/shared/domain/ApiError'

/**
 * Imperative mount. Host entrega um DOM node + props e recebe um unmount().
 * Funciona com qualquer host (Vite, Webpack, Next, legacy), sem acoplar
 * o host ao ciclo de renderização do MF.
 */
export function mount(el: HTMLElement, props: UserManagementAppProps = {}): () => void {
  const root = createRoot(el)
  root.render(
    <StrictMode>
      <UserManagementApp {...props} />
    </StrictMode>,
  )
  return () => {
    root.unmount()
  }
}
