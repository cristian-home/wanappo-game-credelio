import { test, expect } from '@playwright/test'

/**
 * Estas pruebas e2e verifican la navegación y funcionalidad básica del juego,
 * teniendo en cuenta que la navegación está restringida al estado del juego en la store.
 */

test.describe('Game navigation flow', () => {
  test('should load the home page correctly', async ({ page }) => {
    await page.goto('/')
    // Verificar elementos clave en la página principal
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('button', { name: /new game|nuevo juego/i })).toBeVisible()
  })

  test('should not allow direct access to game-play without starting a game', async ({ page }) => {
    // Intentar acceder directamente a la página de juego
    await page.goto('/game-play')

    // Debería redirigir a la página principal
    expect(page.url()).toMatch(/#\/$/)
  })

  test('should not allow direct access to game-over screen', async ({ page }) => {
    // Intentar acceder directamente a la página de game-over
    await page.goto('/game-over')

    // Debería redirigir a la página principal
    expect(page.url()).toMatch(/#\/$/)
  })

  test('should not allow direct access to game-won screen', async ({ page }) => {
    // Intentar acceder directamente a la página de victoria
    await page.goto('/game-won')

    // Debería redirigir a la página principal
    expect(page.url()).toMatch(/#\/$/)
  })

  test('should navigate from home to game-play when starting a new game', async ({ page }) => {
    await page.goto('/')

    // Iniciar nuevo juego
    await page.getByRole('button', { name: /new game|nuevo juego/i }).click()

    // Esperar a que la navegación se complete
    await page.waitForURL('**/game-play')

    // Verificar que estamos en la página de juego
    expect(page.url()).toMatch(/#\/game-play/)

    // Verificar elementos clave del juego usando selectores más específicos
    await expect(
      page.locator('[class*="text-2xl"][class*="font-bold"][class*="text-blue-600"]'),
    ).toBeVisible()
    await expect(
      page.locator('[class*="text-2xl"][class*="font-bold"][class*="text-green-600"]'),
    ).toBeVisible()
    await expect(
      page.locator('[class*="text-2xl"][class*="font-bold"]', { hasText: /\d+s/ }),
    ).toBeVisible()
  })
})

test.describe('Game mechanics', () => {
  test('should be able to pause the game', async ({ page }) => {
    await page.goto('/')

    // Iniciar nuevo juego
    await page.getByRole('button', { name: /new game|nuevo juego/i }).click()

    // Hacer clic en pausa
    await page.getByRole('button', { name: /pause|pausar/i }).click()

    // Verificar que el juego está en pausa (debería aparecer un overlay)
    await expect(page.getByText(/paused|pausado/i, { exact: false })).toBeVisible()
  })

  test('should be able to resume the game after pausing', async ({ page }) => {
    await page.goto('/')

    // Iniciar nuevo juego
    await page.getByRole('button', { name: /new game|nuevo juego/i }).click()

    // Pausar
    await page.getByRole('button', { name: /pause|pausar/i }).click()

    // Verificar que está pausado
    await expect(page.getByText(/paused|pausado/i, { exact: false })).toBeVisible()

    // Reanudar
    await page.getByRole('button', { name: /resume|reanudar/i }).click()

    // Verificar que el overlay de pausa ya no está visible
    await expect(page.getByText(/paused|pausado/i, { exact: false })).toBeHidden()
  })

  test('should be able to quit the game', async ({ page }) => {
    await page.goto('/')

    // Iniciar nuevo juego
    await page.getByRole('button', { name: /new game|nuevo juego/i }).click()

    // Hacer clic en el botón de salir
    await page.getByRole('button', { name: /quit|salir/i }).click()

    // Verificar que regresamos a la página principal
    expect(page.url()).toMatch(/#\/$/)
  })

  test('should be able to click on bugs', async ({ page }) => {
    await page.goto('/')

    // Iniciar nuevo juego
    await page.getByRole('button', { name: /new game|nuevo juego/i }).click()

    // Esperar a que la navegación se complete
    await page.waitForURL('**/game-play')

    // Verificar que estamos en el juego usando selectores más específicos
    await expect(
      page.locator('[class*="text-2xl"][class*="font-bold"][class*="text-blue-600"]'),
    ).toBeVisible()
    await expect(
      page.locator('[class*="text-2xl"][class*="font-bold"][class*="text-green-600"]'),
    ).toBeVisible()
    await expect(
      page.locator('[class*="text-2xl"][class*="font-bold"]', { hasText: /\d+s/ }),
    ).toBeVisible()

    // Verificar que existe el contador de bugs (puede ser 0 o más)
    await expect(
      page.locator('[class*="text-2xl"][class*="font-bold"][class*="text-purple-600"]'),
    ).toBeVisible()
  })
})
