# user-management-mf

Microfrontend React para gerenciamento de usuários em backoffice. Expõe um componente raiz (`UserManagementApp`) e uma API imperativa (`mount`/`unmount`) para montagem em hosts arbitrários.

> Brief: listagem paginada + busca + filtros + drawer de detalhes + tratamento completo de erro/retry, entregue como MF independente, com documentação de integração.

---

## Quickstart

Requisitos: **Node 22+**, **pnpm 10+**.

```bash
pnpm install

pnpm dev              # http://localhost:5173 — MSW intercepta /api
pnpm storybook        # http://localhost:6006 — componentes isolados
pnpm test             # vitest (88 testes)
pnpm test:e2e         # playwright (3 fluxos críticos)
pnpm build            # build do app standalone
pnpm build:mf         # build da biblioteca (dist/user-management-mf.js + types)
pnpm build-storybook  # storybook estático
pnpm typecheck        # tsc --noEmit (strict + noUncheckedIndexedAccess)
pnpm lint             # eslint flat config, zero warnings
```

Pipeline completo que CI roda:

```bash
pnpm typecheck && pnpm lint && pnpm test --run --coverage \
  && pnpm test:e2e && pnpm build:mf && pnpm build-storybook
```

---

## Arquitetura em um relance

Quatro camadas, dependência só pra baixo (enforçado por ESLint `no-restricted-imports`):

```
components/  ─→  controllers/  ─→  services/  ─→  datasource/
(view)          (hooks orch.)     (domain+zod)    (HTTP + retry)
      ↘             ↘                ↘
         ↘             ↘                ↘
           ─────→  domain/  ←───── shared/
                   (types)         (libs)
```

| Camada | Regra | Exemplo |
|---|---|---|
| `components/` | View. NÃO pode importar services/datasource. | `UserTable`, `UserFilters` |
| `controllers/` | Hooks. Orquestra services + react-query + nuqs. NÃO importa datasource. | `useUsersList`, `useUserFilters` |
| `services/` | Valida payload via Zod, mapeia DTO→domain, propaga erros. | `userService`, `userMapper` |
| `datasource/` | HTTP cru + retry + normalização de erro. Só depende de `domain/` e `shared/`. | `httpClient`, `userDatasource` |

Estrutura de pastas:

```
src/
├── UserManagementApp.tsx      # root: QueryClient + NuqsAdapter + ServicesProvider
├── mf-entry.tsx               # API pública do MF (mount + exports)
├── main.tsx                   # bootstrap dev (só em DEV)
├── components/
│   ├── ui/                    # shadcn primitives (button, input, sheet, table...)
│   └── states/                # TableRowsSkeleton, EmptyState, ErrorState
├── modules/users/
│   ├── components/            # UI do módulo + stories + tests
│   ├── controllers/           # useUsersList, useUserDetails, useUserFilters (nuqs)
│   ├── services/              # userService + userMapper (Zod)
│   ├── datasource/            # httpClient + userDatasource
│   ├── domain/                # User, UserFilters (tipos + schemas)
│   ├── mocks/                 # MSW handlers + fixtures seeded
│   └── formatters.ts
└── shared/
    ├── domain/                # ApiError + Result<T,E>
    ├── hooks/                 # useDebouncedValue
    └── lib/                   # retry, formatters, cn (tailwind)
```

---

## Decisões principais (ADRs)

Detalhamento completo em [`ARCHITECTURE.md`](./ARCHITECTURE.md). Resumo:

- **ADR-001** — TanStack Query (server state) + nuqs (URL state). Sem store cliente. Drawer aberto/fechado deriva de `?userId=...` na URL.
- **ADR-002** — Errors-as-values na borda do datasource (`{ ok, data } | { ok, error }`). Exceções só pra bug real.
- **ADR-003** — Retry vive no `httpClient`, **não** no RQ. Exponential backoff + full jitter (AWS convention): base 300ms, cap 3s, mult 2, max 3 retries. Retry em 5xx + 429 + network. Nunca em 4xx.
- **ADR-004** — Vite lib mode + mount imperativo em vez de Module Federation runtime. Brief pede contrato de integração, não federation; deploy fora de escopo. Migração pra MF é cirúrgica (só troca shell do bundle).
- **ADR-005** — shadcn/ui + Tailwind v3. Componentes copiados pro repo (código auditável, rebrand fácil via CSS vars). Tailwind v3 porque shadcn canonical usa `hsl(var(--token))`, v4 usa OKLCH.
- **ADR-006** — MSW como fonte única de mocks (dev + integration + E2E). Dev injeta 15% 503 aleatório pra exercer retry visualmente; testes usam counter determinístico.
- **ADR-007** — Testing Trophy (Kent C. Dodds). Unit só pra lógica pura (retry, mapper). Integration é a maioria (hooks + componentes com providers reais + MSW na borda). E2E reservado pra fluxos críticos.
- **ADR-008** — Component-driven com Storybook 8. Stories só pra componentes que encapsulam decisões do domínio (states, users/*). Primitives shadcn ficam sem stories (duplicaria upstream).
- **ADR-009** — Endpoint test-only `POST /__test__/next-request-fails` pra E2E determinístico do retry. Prefixo `__test__` deixa intent claro e é descartado facilmente.
- **ADR-010** — Linha de tabela clicável via `onClick` no `<tr>` + `<button aria-label>` wrappando o nome na primeira célula. Mantém semântica tr=linha, button=ativador. Melhor que `tr tabindex=0 role=button`.

**Justificativa de state:**

> O módulo tem duas categorias de state: servidor e URL. Server state (lista, detalhes) fica no TanStack Query (cache, paginação com `keepPreviousData`, retry controlado). URL state (filtros + user selecionado) vive no nuqs — URL é source of truth: refresh preserva view, link é compartilhável, back button funciona. Não há terceira categoria. O drawer aberto/fechado é derivado de `?userId=...`, não um booleano separado. Adicionar Zustand/useReducer pra UI state seria resolver problema inexistente.

---

## Tratamento de erro + retry

Padrão errors-as-values na camada datasource. Fluxo:

```
fetch → httpClient
  → 2xx → JSON.parse → { ok: true, data }
  → 204 → { ok: true, data: null }
  → 4xx (body { code, message }) → { ok: false, error } (não retry)
  → 5xx / 429 / net → retry com backoff → esgota → { ok: false, error }
```

- `createApiError('NETWORK_ERROR' | 'INVALID_RESPONSE' | 'USER_NOT_FOUND' | ...)` factory normaliza.
- `isTransientError(error)` inspeciona status/code.
- Service valida payload bom via Zod (`userMapper`). Falha de schema vira `INVALID_RESPONSE` — tratada igual a 5xx pela UI.
- RQ: `retry: false` (senão retria duas vezes), `throwOnError: false`.
- `ErrorState` mostra mensagem + botão "Tentar novamente" que dispara `refetch()`.

---

## Estratégia de testes — Testing Trophy

Distribuição alvo: 15% unit, 70% integration, 15% E2E.

**Unit (lógica pura, sem React):**
- `retry.test.ts` — backoff, jitter bounds, cap, non-retryable early exit (18 casos)
- `userMapper.test.ts` — Zod schema, CPF regex, enums, ISO datetime, malformed payload (18 casos, **obrigatório PDF**)

**Integration (providers reais + MSW):**
- `useUsersList.test.tsx` — loading → success, 4xx sem retry, 5xx com retry, INVALID_RESPONSE, empty, cache hit (6 casos, **obrigatório PDF**)
- `UserFilters.test.tsx` — user-event: debounce único com valor final, status/role selects, "Todos" limpa, reset button, keyboard nav, reflete valor externo (8 casos, **obrigatório PDF**)
- `UserDetailsDrawer.test.tsx` — dialog role, campos, fallback lastLogin, ESC/X fecha, loading skeleton, error retry (8 casos)
- `UserListPage.test.tsx` — smoke + deep linking (5 casos)
- `httpClient.test.ts`, `userDatasource.test.ts`, `userService.test.ts`, `handlers.test.ts` — sanity da cadeia HTTP

**E2E (Playwright, 3 fluxos críticos):**
- Happy path: list → search → filter → drawer → ESC
- Deep linking: `/?status=pending&role=admin&userId=...` abre tudo
- Transient recovery: 2×503 + retry → lista popula, ErrorState nunca é renderizado (validado via MutationObserver)

**Total:** 88 testes unit/integration + 3 E2E, todos verdes.

---

## Mocks

MSW é fonte única — dev, integration tests (setupServer), E2E (service worker).

| Contexto | Latência | Random 503 | Determinismo |
|---|---|---|---|
| Dev (`pnpm dev`) | 300-800ms | 15% | — |
| E2E (`pnpm test:e2e`) | 50ms | desligado via `VITE_E2E_DETERMINISTIC=1` | `POST /__test__/next-request-fails` |
| Vitest integration | 0ms | desligado via `MODE=test` | counter-based via `server.use(...)` |

Nenhum teste depende de `Math.random()`.

Exercitar retry manualmente em dev — console do browser:

```js
// próximas 4 requests da lista falham (> maxRetries=3 → ErrorState aparece)
await fetch('/__test__/next-request-fails', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ count: 4 }),
})

// reset contador
await fetch('/__test__/reset', { method: 'POST' })
```

---

## Integração com host

Ver [`docs/INTEGRATION.md`](./docs/INTEGRATION.md). Resumo:

```tsx
import { UserManagementApp } from 'user-management-mf'

<UserManagementApp
  apiBaseUrl="/api"
  authToken={() => getToken()}
  onUserSelected={(u) => track(u.id)}
/>
```

Ou mount imperativo:

```ts
import { mount } from 'user-management-mf'
const unmount = mount(document.getElementById('mf')!, { apiBaseUrl: '/api' })
```

**Peer dependencies do host:** `react@^18`, `react-dom@^18`, `@tanstack/react-query@^5`.

---

## O que eu faria com mais tempo

- Virtualização de linhas — útil acima de ~500 linhas por página.
- Ações em lote (ativar/desativar múltiplos usuários selecionados).
- Dark mode.
- i18n (strings centralizadas, hoje pt-BR hardcoded).
- Telemetria via `onError` prop (hoje callback declarado mas não invocado pelo core).

---

## Trade-offs assumidos

- **Lib mode > Module Federation**: federation runtime sem deploy é overhead. Documentei migração em INTEGRATION.md.
- **shadcn > MUI**: código no repo, customização via CSS vars, sem dependência pesada. Custo: componentes viraram parte do repo (tradeable por update hygiene).
- **Single-select nos filtros > multi-select**: UI simplificada. API REST ainda suporta repeatable (`?status=a&status=b`) se multi-select for necessário depois.
- **Tailwind v3 pinado**: shadcn canonical idiom. v4 ainda não tem ecosystem maduro com Radix + shadcn stable.

---

## Estrutura do repo (mapa rápido)

```
user-management-mf/
├── .github/workflows/ci.yml     # pipeline completo
├── .storybook/                  # storybook 8 + msw addon
├── docs/INTEGRATION.md          # contrato MF detalhado
├── e2e/                         # 3 fluxos Playwright
├── public/mockServiceWorker.js  # gerado por msw init
├── src/                         # código (ver arquitetura acima)
├── ARCHITECTURE.md              # ADRs detalhadas
├── README.md                    # este arquivo
├── components.json              # shadcn CLI
├── vite.config.ts               # modo app + modo mf (lib)
├── vitest.config.ts             # jsdom + coverage
├── playwright.config.ts         # chromium-only + webServer
├── tailwind.config.ts           # tokens Localiza
└── eslint.config.js             # flat + layer boundaries
```
