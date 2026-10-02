import { createContext, useContext, type ReactNode } from 'react'
import type { UserService } from '@/modules/users/services/userService'

interface Services {
  userService: UserService
}

const ServicesContext = createContext<Services | null>(null)

interface ServicesProviderProps extends Services {
  children: ReactNode
}

export function ServicesProvider({ userService, children }: ServicesProviderProps) {
  return <ServicesContext.Provider value={{ userService }}>{children}</ServicesContext.Provider>
}

export function useUserService(): UserService {
  const ctx = useContext(ServicesContext)
  if (!ctx) {
    throw new Error('useUserService precisa estar dentro de <ServicesProvider>')
  }
  return ctx.userService
}
