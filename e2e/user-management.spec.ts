import { test, expect } from '@playwright/test'

// E2E reservado pra fluxos que atravessam múltiplos componentes. 
// Flows curtos já cobertos por vitest integration.

test.describe('user-management-mf — fluxos críticos', () => {
  test('Flow 1 — happy path: list → filter → drawer', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /gestão de usuários/i })).toBeVisible()

    const rows = page.getByRole('row')
    await expect.poll(async () => await rows.count(), { timeout: 10_000 }).toBeGreaterThan(1)

    // Busca reflete na URL
    await page.getByLabel('Buscar usuários').fill('maria')
    await expect.poll(() => page.url(), { timeout: 3_000 }).toContain('search=maria')

    // Filtro status=Ativo
    await page.getByLabel('Status').click()
    await page.getByRole('option', { name: 'Ativo', exact: true }).click()
    await expect.poll(() => page.url()).toContain('status=active')

    // Linhas restantes após filtro
    await expect.poll(async () => await page.getByRole('row').count()).toBeGreaterThan(1)

    // Abrir drawer
    const firstTrigger = page.getByRole('button', { name: /ver detalhes de/i }).first()
    const firstName = (await firstTrigger.getAttribute('aria-label'))!.replace(
      /^ver detalhes de /i,
      '',
    )
    await firstTrigger.click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading', { name: firstName })).toBeVisible()
    await expect(dialog.getByText(/cpf/i)).toBeVisible()

    // ESC fecha + URL limpa
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    expect(page.url()).not.toContain('userId=')
  })

  test('Flow 2 — deep link abre drawer já filtrado', async ({ page }) => {
    await page.goto('/?status=pending&role=admin&userId=usr_000001')

    // Drawer aberto imediatamente com usuário alvo (dialog modal esconde
    // o resto da página via aria-hidden — validar filtros depois de fechar)
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText('usr_000001')).toBeVisible()

    // Fecha drawer e valida que filtros da URL refletem nos controles
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()

    await expect(page.getByLabel('Status')).toContainText(/pendente/i)
    await expect(page.getByLabel('Perfil')).toContainText(/administrador/i)
  })

  test('Flow 3 — transient 503 recupera via retry sem ErrorState flash', async ({ page }) => {
    // Observer global: marca se algum momento ErrorState for montado no DOM
    let errorStateSeen = false
    await page.exposeFunction('__reportErrorSeen', () => {
      errorStateSeen = true
    })
    await page.addInitScript(() => {
      const observer = new MutationObserver(() => {
        if (document.querySelector('[data-testid="error-state"]')) {
          // @ts-expect-error binding exposto
          window.__reportErrorSeen?.()
        }
      })
      // inicia observando depois que body existe
      const start = () =>
        observer.observe(document.body, { childList: true, subtree: true })
      if (document.body) start()
      else document.addEventListener('DOMContentLoaded', start)
    })

    // Primeira carga: lista popula normalmente (MSW registra o worker)
    await page.goto('/')
    await expect
      .poll(async () => await page.getByRole('row').count(), { timeout: 15_000 })
      .toBeGreaterThan(1)

    // Primar próximas 2 requests com 503 via fetch no contexto da página
    // (só assim atinge o service worker do MSW)
    await page.evaluate(async () => {
      await fetch('/__test__/next-request-fails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 2 }),
      })
    })

    // Reload força nova request de lista → 2×503 + 1×200 via retry do httpClient
    errorStateSeen = false
    await page.reload()
    await expect
      .poll(async () => await page.getByRole('row').count(), { timeout: 15_000 })
      .toBeGreaterThan(1)

    await expect(page.getByTestId('error-state')).toHaveCount(0)
    expect(errorStateSeen).toBe(false)
  })
})
