# Guia de integração — `user-management-mf`

Microfrontend de gerenciamento de usuários para backoffice. Expõe um componente raiz React + uma API imperativa `mount`/`unmount` para montagem em hosts arbitrários.

## TL;DR

```bash
# instalar (workspace / file: / registry interno)
pnpm add user-management-mf @tanstack/react-query
```

```tsx
// host React moderno
import { UserManagementApp } from 'user-management-mf'

<UserManagementApp apiBaseUrl="/api" />
```

```ts
// host vanilla / legado / não-React
import { mount } from 'user-management-mf'

const container = document.getElementById('user-mf')!
const unmount = mount(container, { apiBaseUrl: '/api' })
// mais tarde: unmount()
```

---

## Pré-requisitos do host

Peer dependencies (o host precisa instalar — **não** são embutidas no bundle):

| Pacote | Versão | Motivo |
|---|---|---|
| `react` | `^18.0.0` | Renderer |
| `react-dom` | `^18.0.0` | `createRoot` |
| `@tanstack/react-query` | `^5.0.0` | Server state (cache, paginação, retry) |

O bundle do MF é emitido como ESM (`dist/user-management-mf.js`) com essas três externalized. Hosts que não sejam React (vanilla, Angular, Vue) ainda precisam delas disponíveis — a API `mount` instancia React por baixo.

---

## API pública

### Componente: `UserManagementApp`

```tsx
import { UserManagementApp } from 'user-management-mf'

<UserManagementApp
  apiBaseUrl="/api"
  authToken={() => getToken()}
  onUserSelected={(user) => track('user_opened', user.id)}
  onError={(error) => reportToSentry(error)}
/>
```

#### Props

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `apiBaseUrl` | `string` | `'/api'` | URL base onde o módulo consome `GET /users`, `GET /users/:id`. |
| `authToken` | `string \| () => string \| Promise<string>` | — | Token Bearer. Aceita string ou getter (lazy/async). Se ausente, header `Authorization` não é injetado. |
| `queryClient` | `QueryClient` | — | Host pode injetar o próprio `QueryClient` pra compartilhar cache. Se não passar, MF instancia um interno. |
| `onUserSelected` | `(user: User) => void` | — | Disparado ao abrir o drawer de detalhes. |
| `onError` | `(error: ApiError) => void` | — | Disparado em erros não-transitórios (reservado — ainda não é invocado pelo core; reservado pra telemetria). |
| `className` | `string` | `'mx-auto max-w-7xl p-6'` | Classes Tailwind aplicadas ao wrapper. Passe `''` se o host quer controlar 100% do layout externo. |

### API imperativa: `mount(el, props) → unmount`

Para hosts não-React (microfrontends com Single-SPA, plugins WordPress, shells legados, etc.).

```ts
import { mount } from 'user-management-mf'

const container = document.querySelector('#mf-slot')!
const unmount = mount(container, {
  apiBaseUrl: 'https://api.localiza.internal/backoffice',
  authToken: async () => await getFreshToken(),
})

// quando o host navegar pra fora ou remontar:
unmount()
```

Assinatura:

```ts
export function mount(
  el: HTMLElement,
  props?: UserManagementAppProps,
): () => void
```

### Tipos exportados

```ts
import type {
  User,
  UserRole,
  UserStatus,
  UserFilters,
  ApiError,
  ApiErrorCode,
  UserManagementAppProps,
} from 'user-management-mf'
```

---

## Contrato com o backend

O MF assume que `apiBaseUrl` expõe:

- `GET /users?page&pageSize&search&status&role` → `{ data: User[], pagination: { page, pageSize, total, totalPages } }`
  - `status` e `role` são repeatable (`?status=active&status=pending`)
- `GET /users/:id` → `User` ou `404 { code: "USER_NOT_FOUND", message }`
- Erros: formato padronizado `{ code: string, message: string }` em qualquer 4xx/5xx

Paginação é **server-side**. Filtros vão como query params. Retry para 5xx/429/network vive no cliente HTTP do MF.

---

## Estado compartilhado (URL)

O MF usa **URL como source of truth** (via [nuqs](https://nuqs.47ng.com)) para:

- `?search=...`
- `?status=active&status=pending`
- `?role=admin`
- `?page=3&pageSize=50`
- `?userId=usr_000001` → drawer de detalhes abre deep-link

O host **não** precisa participar desse estado — o MF lê/escreve na URL do host sozinho. Se o host usa seu próprio router (React Router, Next.js), isso coexiste: nuqs só lê/escreve query params, não toca no pathname.

**Implicação prática:** links compartilhados entre usuários carregam a mesma view. Botão voltar funciona. Refresh preserva filtros.

---

## Por que _não_ Module Federation?

A decisão foi entregar como **Vite lib mode + mount imperativo** em vez de `@module-federation/vite` runtime. Motivos:

- O brief pede "componente raiz montável em host + documentação de integração". É contrato, não federation runtime.
- Deploy está fora de escopo — federation runtime sem deploy é overhead sem retorno.
- Vite + Module Federation ainda tem atritos (singleton de React, HMR cross-remote, order of shared deps).
- Mount imperativo funciona com **qualquer** host (Webpack, Vite, Next, legacy, vanilla).

### Migrar para Module Federation depois

Se o host precisar de carregamento dinâmico de bundles em runtime, a migração é cirúrgica:

1. Trocar o build mode (`vite build --mode mf`) por `@module-federation/vite` com entry apontando pra `src/mf-entry.tsx`.
2. Declarar `react`, `react-dom`, `@tanstack/react-query` como shared singletons.
3. Host consome `import('user-management-mf/UserManagementApp')` em runtime.

A **camada de domínio, controllers, services, datasource, componentes, testes** — tudo o que importa — **não muda uma linha**. Só troca o shell do bundle.

---

## Dependências embutidas

O bundle do MF inclui (no `dist/user-management-mf.js`):

- nuqs
- zod
- shadcn/ui components + Radix primitives (`@radix-ui/*`)
- Tailwind CSS classes (pré-compiladas — não requer Tailwind no host)
- lucide-react (tree-shakeable — só ícones usados)
- TanStack Query código é **externalized**; você precisa instalar no host.

Bundle atual: **328 KB** (gzip **79 KB**).

---

## Estilo / tema

O MF injeta suas próprias CSS vars (via `@layer base :root { --primary ... }`). Se o host já define essas vars, o MF respeita. Classes Tailwind do MF estão pré-geradas; o host pode usar qualquer framework CSS sem conflito.

Para rebranding além do verde Localiza, sobrescreva no host:

```css
:root {
  --primary: 220 70% 50%; /* azul */
  --ring: 220 70% 50%;
}
```

---

## Exemplo completo (host Vite + React)

```tsx
// host/src/pages/AdminUsers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserManagementApp } from 'user-management-mf'

const queryClient = new QueryClient()

export function AdminUsersPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserManagementApp
        apiBaseUrl={import.meta.env.VITE_API_URL}
        authToken={() => localStorage.getItem('token') ?? ''}
        queryClient={queryClient}
        onUserSelected={(u) => console.log('opened', u.id)}
      />
    </QueryClientProvider>
  )
}
```

---

## Testando o MF isoladamente

```bash
pnpm install
pnpm dev            # :5173 com MSW interceptando /api
pnpm storybook      # :6006 — componentes isolados
pnpm test           # vitest (88 tests)
pnpm test:e2e       # playwright (3 fluxos críticos)
pnpm build:mf       # gera dist/ pra consumo
```

Em dev, MSW injeta ~15% de falhas 503 artificialmente para exercer o retry visualmente.

---

## Troubleshooting

| Sintoma | Causa provável | Fix |
|---|---|---|
| `useUserService precisa estar dentro de <ServicesProvider>` | Host montou `UserListPage` diretamente em vez de `UserManagementApp` | Sempre usar `UserManagementApp` ou `mount()` como entry |
| `404 Not Found /api/users` no browser | `apiBaseUrl` não bate com a API real | Verificar prop + CORS |
| Bundle duplicado de React | Host não marcou react como singleton / externalized | Confirmar que host resolve para a mesma instância (pnpm dedupe, webpack externals) |
| Filtros não aparecem na URL | Host usa fragment router (`#/foo`) que intercepta `?query` | nuqs respeita o host router; se `window.location.search` não atualiza, investigar adapter |
