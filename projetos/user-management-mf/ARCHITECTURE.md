# Arquitetura — `user-management-mf`

Documento complementar ao [`README.md`](./README.md). Detalha ADRs, fluxos de dados e regras de layering.

---

## Contexto

Microfrontend de gerenciamento de usuários (backoffice). O MF precisa:

1. Ser consumível por qualquer host React (e por hosts não-React via mount imperativo).
2. Carregar dados de uma API REST com paginação server-side, filtros via query params, erros padronizados `{ code, message }`, e retry para 5xx transitórios.
3. Manter filtros como URL source of truth pra permitir deep links e back-button semântico.
4. Ser testável nas múltiplas camadas, com mocks determinísticos.
5. Ficar pronto pra produção (tratamento de erro completo, a11y, responsivo 1024px+).

---

## Camadas e dependências

```
                  ┌──────────────────────────┐
                  │  components/             │   View — React + shadcn
                  │  (UserTable, Filters,    │
                  │   Drawer, Pagination)    │
                  └────────────┬─────────────┘
                               │ importa
                               ▼
                  ┌──────────────────────────┐
                  │  controllers/            │   Hooks: orquestra estado
                  │  (useUsersList,          │   + cache + URL
                  │   useUserFilters,        │
                  │   useUserDetails)        │
                  └────────────┬─────────────┘
                               │ via useUserService()
                               ▼
                  ┌──────────────────────────┐
                  │  services/               │   Domain: valida payload,
                  │  (userService,           │   mapeia DTO→domain
                  │   userMapper+Zod)        │
                  └────────────┬─────────────┘
                               │ usa UserDatasource
                               ▼
                  ┌──────────────────────────┐
                  │  datasource/             │   HTTP: retry + normaliza
                  │  (httpClient +           │   erros, resposta é
                  │   userDatasource)        │   Result<unknown, ApiError>
                  └──────────────────────────┘
```

**Regra dura (enforçada por ESLint `no-restricted-imports`):**

| De | Pode | Não pode |
|---|---|---|
| `components/` | controllers, domain, shared, `components/ui` | services, datasource |
| `controllers/` | services, domain, shared | datasource |
| `services/` | datasource, domain, shared | controllers, components |
| `datasource/` | domain, shared | services, controllers, components |

Config em [`eslint.config.js`](./eslint.config.js#L19-L74). Violar = build quebra no CI.

---

## Fluxo — happy path

```
 user → UserFilters.onChange(patch)
          │
          ▼
    useUserFilters (nuqs)
          │   atualiza URL ?search=maria&page=1
          ▼
    URL muda → useUsersList lê filters → queryKey muda
          │
          ▼
    TanStack Query
          │   cache miss → queryFn dispara
          ▼
    userService.list(filters)
          │
          ▼
    userDatasource.list(filters)
          │   monta URLSearchParams (status[], role[] repeatable)
          ▼
    httpClient.request('/users?...')
          │   retry wrapper ativo
          ▼
    fetch → Response
          │
          ├─ 2xx → JSON.parse → volta Result<unknown, ApiError>
          │         │
          │         ▼
          │   userMapper.mapUserList (Zod safeParse)
          │         │
          │         ├─ success → Result<UserListResponse>
          │         │
          │         └─ fail → Result<INVALID_RESPONSE>
          │
          ├─ 4xx com body {code,message} → ApiError normalizado (sem retry)
          │
          └─ 5xx / 429 / net → retry backoff+jitter → se esgota vira ApiError
```

---

## ADRs detalhadas

### ADR-001 — TanStack Query + nuqs, sem store cliente

**Decisão:** server state vai no RQ; URL state vai no nuqs; UI state ... não existe.

**Por quê:** adicionar Zustand/useReducer pra armazenar "drawer aberto" seria duplicar informação que a URL já carrega. `selectedUserId = filters.userId || null`. Drawer open = `selectedUserId !== null`. Back button, refresh, deep link — tudo de graça.

**Consequência:** cada mudança de filtro/seleção gera URL update. Com `history: 'replace'`, nuqs não polui histórico a cada tecla do search (o debounce garante que só o valor final entra na história navegável via back/forward — o intermediário só aparece no endereço).

---

### ADR-002 — Errors-as-values na borda do datasource

**Decisão:** `httpClient.request()` retorna `Result<T, ApiError>`. Nunca lança pra chamador.

**Por quê:** exceções deveriam sinalizar **bug**, não estado de erro esperado. Uma 404 no server é estado esperado (usuário não encontrado). Forçar try/catch em cada controller poluiria o código. Com Result, caller escreve:

```ts
const r = await service.list(filters)
if (!r.ok) return handleError(r.error)
renderList(r.data)
```

Tipos discriminated union dão exhaustiveness check via TS.

**Consequência:** dentro do `httpClient`, exceções são apenas transporte interno (retry helper relança pra contar falhas). Na fronteira externa, sempre Result.

---

### ADR-003 — Retry no datasource, não no TanStack Query

**Decisão:** [`shared/lib/retry.ts`](./src/shared/lib/retry.ts) faz o retry. RQ config: `retry: false`.

**Por quê:**
- Retry é concern de transporte, não de cache. Vive junto com fetch.
- RQ retry faz exponential backoff próprio, mas não tem jitter determinístico nem easy access a status codes → decisões de retryable ficariam opacas.
- Testar retry puro é trivial (inject sleep+jitter). Testar retry RQ + MSW + timers é pesadelo.
- Se RQ retria **e** httpClient retria, são 9 tentativas escondidas (3 × 3).

Config: base 300ms, cap 3000ms, multiplier 2, max 3 retries. Full jitter (`delay = random(0, exp)`) — convenção AWS.

**Retryable:** `isNetworkError`, `code === 'NETWORK_ERROR'|'TIMEOUT'`, status 5xx, status 429.
**Não retryable:** qualquer outro 4xx.

---

### ADR-004 — Vite lib mode + mount imperativo

**Decisão:** build produz ESM único (`dist/user-management-mf.js`) que expõe `UserManagementApp` (componente) + `mount(el, props)` (imperativo). **Sem** `@module-federation/vite`.

**Por quê:**
- O brief pede "componente raiz montável + documentação de integração". É contrato de API, não federation runtime.
- Deploy está explicitamente fora de escopo. Federation sem deploy é overhead.
- Vite + MF ainda tem arestas (singleton de React, HMR cross-remote, ordem de shared deps).
- Mount imperativo funciona com **qualquer** host (Webpack, Vite, Next, legacy, vanilla).

**Migração para MF runtime** (se host precisar no futuro): trocar `vite build --mode mf` por `@module-federation/vite` apontando pra `src/mf-entry.tsx`, declarar `react`/`react-dom`/`@tanstack/react-query` como shared singletons. Camadas de domínio/controllers/services/datasource **não mudam uma linha**.

---

### ADR-005 — shadcn/ui + Tailwind v3

**Decisão:** shadcn/ui canonical (Radix por baixo) + Tailwind v3, não v4.

**Por quê v3 e não v4:** shadcn canonical usa `hsl(var(--token))`. Tailwind v4 usa OKLCH em `@theme`. Mixar os dois causa bugs sutis de tema. v3 é a combinação battle-tested em 2026.

**Por quê shadcn e não MUI/Chakra:** código no repo (auditável, rebrandável via CSS vars), sem framework lock-in, Radix primitives dão a11y gratuita (focus trap no Dialog, ARIA completo no Select).

**Custo:** componentes shadcn viram parte do repo — updates são manuais. Aceitável pro escopo do teste; revisível em codebase maior.

---

### ADR-006 — MSW como fonte única de mocks

**Decisão:** MSW intercepta `/api/users*` em dev (service worker), integration tests (`setupServer`), E2E (service worker).

**Por quê:** uma única especificação do contrato de API. Refactor de handler reflete em todos os contextos. Testes em jsdom + Playwright no chromium + dev no browser vêem a mesma coisa.

**Determinismo:**
- Dev: latência 300-800ms random + 15% 503 random pra exercer retry visualmente.
- E2E: `VITE_E2E_DETERMINISTIC=1` desliga random (handler lê `import.meta.env.VITE_E2E_DETERMINISTIC`). Latência reduzida pra 50ms.
- Vitest: `MODE=test` detecta → latência 0 + random off. Cada teste reseta via `afterEach(() => { server.resetHandlers(); resetMswState() })`.

---

### ADR-007 — Testing Trophy

**Decisão:** seguir Kent C. Dodds Testing Trophy em vez da pirâmide clássica.

**Forma prática:**
- **Unit** só pra lógica pura sem React: `retry.ts`, `userMapper.ts`, `useDebouncedValue` (puro demais pra precisar de integration).
- **Integration** é a maioria: hooks + componentes com providers reais + MSW na borda. Exercitam o wire real entre camadas.
- **E2E** só pra fluxos críticos que cruzam todo o sistema (3 flows no Playwright).
- **Nunca mock o que você controla.** Datasource e service não são mockados — MSW é o único ponto de mock.

**Resultado:** 88 testes unit/integration + 3 E2E. Cobertura >80% em `services/`, `controllers/`, `datasource/`, `shared/`. Componentes cobertos por osmose via integration tests.

---

### ADR-008 — Storybook só pra componentes de domínio

**Decisão:** stories em `src/modules/users/components/*.stories.tsx` e `src/components/states/*.stories.tsx`. Primitives shadcn em `src/components/ui/` **não** têm stories.

**Por quê:** shadcn primitives já documentadas em [ui.shadcn.com](https://ui.shadcn.com). Radix primitives em [radix-ui.com](https://radix-ui.com). Duplicar = manutenção sem payoff.

Stories agregam valor quando encapsulam decisões do domínio — `StatusBadge` (mapeia `UserStatus` → variant+label), `UserTable` (loading/empty/selected), `ErrorState` (4xx sem retry vs 5xx com retry).

**Sidebar fica:** `States/`, `Users/`.

---

### ADR-009 — Endpoint test-only `/__test__/next-request-fails`

**Decisão:** MSW expõe `POST /__test__/next-request-fails` que seta contador `forcedFailures`. Próximas N requests retornam 503 determinísticos; depois volta ao normal.

**Por quê:** E2E Flow 3 (transient recovery) não pode depender de `Math.random()`. Precisa determinismo pra assertar que `ErrorState` nunca é renderizado durante o retry.

**Alternativas consideradas:**
- Playwright `page.route()` interceptando network — criaria segunda fonte de mocks, divergindo do dev.
- Env var por request — frágil, precisa correlacionar por header.
- Counter no handler — simples, contido no MSW, descartável (prefixo `__test__`).

**Consequência:** endpoint existe em dev também, mas sem risco (nome explícito, sem side effect além de setar contador).

---

### ADR-010 — Row clicável: `<tr onClick>` + `<button aria-label>` interno

**Decisão:** `<tr>` recebe `onClick` (handler `handleSelect`). Primeira célula contém `<button aria-label="Ver detalhes de {nome}">` visualmente integrado. Sem `tabindex`/`role=button` no `<tr>`.

**Por quê:** `<tr tabindex=0 role=button>` confunde screen readers — a linha vira botão mas continua sendo linha de tabela. Padrão correto: linha mantém semântica `row`, existe UM botão focável por linha (primeira célula), clique em qualquer célula dispara ação via bubble.

**A11y verificado em integration test:** `UserFilters.test.tsx` valida tab order, `UserDetailsDrawer.test.tsx` valida focus trap + ESC, `UserListPage.test.tsx` valida click row abre drawer.

---

## Estrutura de testes

```
src/
├── shared/lib/__tests__/retry.test.ts              # 18 casos
├── modules/users/
│   ├── services/__tests__/
│   │   ├── userMapper.test.ts                      # 18 (obrigatório PDF)
│   │   └── userService.test.ts                     # 5 integration
│   ├── datasource/__tests__/
│   │   ├── httpClient.test.ts                      # 10 via MSW
│   │   └── userDatasource.test.ts                  # 4 via MSW
│   ├── controllers/__tests__/
│   │   └── useUsersList.test.tsx                   # 6 (obrigatório PDF)
│   ├── components/__tests__/
│   │   ├── UserFilters.test.tsx                    # 8 (obrigatório PDF)
│   │   ├── UserDetailsDrawer.test.tsx              # 8
│   │   └── UserListPage.test.tsx                   # 5
│   └── mocks/__tests__/handlers.test.ts            # 6 smoke
└── test/
    ├── setup.ts                                    # MSW server + Radix polyfills
    └── renderWithProviders.tsx                     # helper com QueryClient + NuqsTestingAdapter + ServicesProvider

e2e/user-management.spec.ts                         # 3 flows
```

Polyfills jsdom em `test/setup.ts`: `hasPointerCapture`, `releasePointerCapture`, `setPointerCapture`, `scrollIntoView` — Radix Select/Dialog precisam, jsdom não implementa.

---

## Observações finais

- **Sem console.log no código** (`no-console` rule permite só `warn/error`).
- **Zero `any` + zero `@ts-ignore`** no código de domínio.
- **ESLint `--max-warnings 0`** no CI.
- **Prettier sem semicolons** (configuração do projeto).
- **pnpm 10** + **Node 22**.
- **React 18.3** (não 19) porque ecosistema shadcn/nuqs/RQ ainda tem arestas com 19; compromisso pro escopo do teste.

Dúvidas de integração: [`docs/INTEGRATION.md`](./docs/INTEGRATION.md).
