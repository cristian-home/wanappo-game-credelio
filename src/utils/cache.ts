/**
 * Cache and storage management utilities
 */

/**
 * Clear all localStorage data including Pinia persisted state
 */
export function clearAllLocalStorage(): void {
  try {
    localStorage.clear()
    console.log('✅ LocalStorage cleared successfully')
  } catch (error) {
    console.error('❌ Failed to clear localStorage:', error)
  }
}

/**
 * Clear specific Pinia store data from localStorage
 */
export function clearPiniaStore(storeName: string): void {
  try {
    localStorage.removeItem(storeName)
    console.log(`✅ Pinia store "${storeName}" cleared from localStorage`)
  } catch (error) {
    console.error(`❌ Failed to clear Pinia store "${storeName}":`, error)
  }
}

/**
 * Clear all Pinia stores (based on your current stores)
 */
export function clearAllPiniaStores(): void {
  const storeNames = ['game', 'language', 'counter']
  storeNames.forEach((storeName) => clearPiniaStore(storeName))
}

/**
 * Clear sessionStorage
 */
export function clearSessionStorage(): void {
  try {
    sessionStorage.clear()
    console.log('✅ SessionStorage cleared successfully')
  } catch (error) {
    console.error('❌ Failed to clear sessionStorage:', error)
  }
}

/**
 * Force reload the page bypassing all caches
 */
export function forceReload(): void {
  // Clear all storage first
  clearAllLocalStorage()
  clearSessionStorage()

  // Force reload bypassing cache
  window.location.reload()
}

/**
 * Add cache-busting timestamp to current URL and reload
 */
export function reloadWithCacheBust(): void {
  const url = new URL(window.location.href)
  url.searchParams.set('t', Date.now().toString())
  window.location.href = url.toString()
}

/**
 * Clear browser cache using Cache API (if available)
 */
export async function clearCacheAPI(): Promise<void> {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
      console.log('✅ Cache API cleared successfully')
    } catch (error) {
      console.error('❌ Failed to clear Cache API:', error)
    }
  } else {
    console.warn('⚠️ Cache API not available in this browser')
  }
}

/**
 * Complete cache and storage cleanup
 */
export async function clearEverything(): Promise<void> {
  console.log('🧹 Starting complete cache cleanup...')

  // Clear all storage
  clearAllLocalStorage()
  clearSessionStorage()

  // Clear Cache API
  await clearCacheAPI()

  console.log('✅ Complete cleanup finished')
}

/**
 * Add no-cache headers to fetch requests
 */
export function createNoCacheFetch() {
  return (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const headers = new Headers(init?.headers)
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    headers.set('Pragma', 'no-cache')
    headers.set('Expires', '0')

    return fetch(input, {
      ...init,
      headers,
      cache: 'no-store',
    })
  }
}
