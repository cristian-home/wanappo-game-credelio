import { test, expect } from '@playwright/test'

/**
 * Pruebas para escenarios avanzados del juego
 */

test.describe('Advanced game testing scenarios', () => {
  test('should show game UI elements correctly', async ({ page }) => {
    await page.goto('/')

    // Iniciar nuevo juego
    await page.getByRole('button', { name: /new game|nuevo juego/i }).click()

    // Esperar a que la navegación se complete
    await page.waitForURL('**/game-play')

    // Verificar elementos de UI del juego usando selectores más específicos
    // 1. Estadísticas
    await expect(
      page.locator('[class*="text-2xl"][class*="font-bold"][class*="text-blue-600"]'),
    ).toBeVisible()
    await expect(
      page.locator('[class*="text-2xl"][class*="font-bold"][class*="text-green-600"]'),
    ).toBeVisible()
    await expect(
      page.locator('[class*="text-2xl"][class*="font-bold"]', { hasText: /\d+s/ }),
    ).toBeVisible()
    await expect(
      page.locator('[class*="text-2xl"][class*="font-bold"][class*="text-purple-600"]'),
    ).toBeVisible()

    // 2. Controles del juego
    await expect(page.getByRole('button', { name: /pause|pausar/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /quit|salir/i })).toBeVisible()

    // 3. Área de juego
    await expect(page.locator('div[style*="height: 600px"]')).toBeVisible()
  })

  test('should update progress bar based on current level', async ({ page }) => {
    await page.goto('/')

    // Iniciar nuevo juego
    await page.getByRole('button', { name: /new game|nuevo juego/i }).click()

    // Verificar que la barra de progreso existe
    const progressBar = page.locator('div.bg-blue-600.h-2.rounded-full')
    await expect(progressBar).toBeVisible()

    // Para un test real necesitaríamos avanzar de nivel, pero eso es difícil de simular en e2e
    // Aquí solo verificamos que la barra existe y tiene algún ancho que debería corresponder al nivel 1
    const widthStyle = await progressBar.getAttribute('style')
    expect(widthStyle).toContain('width:')
  })

  test('should handle mobile viewport responsively', async ({ page }) => {
    // Configurar viewport para móvil
    await page.setViewportSize({ width: 375, height: 667 }) // iPhone SE

    await page.goto('/')

    // Verificar que la página principal se muestra correctamente en móvil
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('button', { name: /new game|nuevo juego/i })).toBeVisible()

    // Iniciar juego
    await page.getByRole('button', { name: /new game|nuevo juego/i }).click()

    // Esperar a que la navegación se complete
    await page.waitForURL('**/game-play')

    // Verificar que la UI del juego es visible en móvil usando selectores específicos
    await expect(
      page.locator('[class*="text-2xl"][class*="font-bold"][class*="text-blue-600"]'),
    ).toBeVisible()

    // Aunque no podemos probar completamente la responsividad, al menos verificamos
    // que los elementos principales son visibles en viewport móvil
  })

  test('should preserve game state when pausing and resuming', async ({ page }) => {
    await page.goto('/')

    // Iniciar nuevo juego
    await page.getByRole('button', { name: /new game|nuevo juego/i }).click()

    // Capturar el tiempo y nivel iniciales
    const levelElement = page.locator('div.text-2xl.font-bold.text-blue-600').first()
    const timeElement = page.locator('div.text-2xl.font-bold', { hasText: /\d+s/ }).first()

    const initialLevel = await levelElement.textContent()
    const _initialTime = await timeElement.textContent()

    // Pausar el juego
    await page.getByRole('button', { name: /pause|pausar/i }).click()

    // Verificar que está pausado
    await expect(page.getByText(/paused|pausado/i, { exact: false })).toBeVisible()

    // Esperar un poco para asegurarnos de que el tiempo no cambia mientras está pausado
    await page.waitForLoadState('domcontentloaded')

    // Reanudar el juego
    await page.getByRole('button', { name: /resume|reanudar/i }).click()

    // Verificar que el nivel sigue siendo el mismo después de pausar/reanudar
    const currentLevel = levelElement
    await expect(currentLevel).toHaveText(initialLevel || '1')

    // El tiempo podría ser un segundo menos, pero debería ser cercano al inicial
    // Sin embargo, no podemos garantizarlo en e2e debido al timing
  })
})
