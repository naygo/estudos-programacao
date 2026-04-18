import { z } from 'zod'

export const userRoles = ['admin', 'operator', 'viewer'] as const
export type UserRole = (typeof userRoles)[number]

export const userStatuses = ['active', 'inactive', 'pending'] as const
export type UserStatus = (typeof userStatuses)[number]

export const userRoleSchema = z.enum(userRoles)
export const userStatusSchema = z.enum(userStatuses)

export const userSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato 000.000.000-00'),
  role: userRoleSchema,
  status: userStatusSchema,
  department: z.string().min(1),
  createdAt: z.string().datetime({ offset: true }),
  lastLogin: z.string().datetime({ offset: true }).nullable(),
})

export type User = z.infer<typeof userSchema>

export const paginationSchema = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
})

export type Pagination = z.infer<typeof paginationSchema>

export const userListResponseSchema = z.object({
  data: z.array(userSchema),
  pagination: paginationSchema,
})

export type UserListResponse = z.infer<typeof userListResponseSchema>
