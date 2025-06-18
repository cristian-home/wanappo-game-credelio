/**
 * Version and cache busting utilities for production deployments
 */

interface AppVersion {
  version: string
  buildHash: string
  buildTime: string
}

/**
 * Get current app version info
 */
export function getAppVersion(): AppVersion {
  return {
    version: import.meta.env.VITE_APP_VERSION || '0.0.5',
    buildHash: import.meta.env.VITE_BUILD_HASH || 'dev',
    buildTime: import.meta.env.VITE_BUILD_TIME || new Date().toISOString(),
  }
}

/**
 * Check if a new version is available by comparing with stored version
 */
export function checkForNewVersion(): {
  isNewVersion: boolean
  currentVersion: AppVersion
  storedVersion: AppVersion | null
} {
  const currentVersion = getAppVersion()
  const storedVersionStr = localStorage.getItem('app-version')
  const storedVersion = storedVersionStr ? JSON.parse(storedVersionStr) : null

  const isNewVersion =
    !storedVersion ||
    storedVersion.version !== currentVersion.version ||
    storedVersion.buildHash !== currentVersion.buildHash

  return {
    isNewVersion,
    currentVersion,
    storedVersion,
  }
}

/**
 * Store current version info
 */
export function storeCurrentVersion(): void {
  const currentVersion = getAppVersion()
  localStorage.setItem('app-version', JSON.stringify(currentVersion))
}

/**
 * Handle version change - clear caches if new version detected
 */
export async function handleVersionChange(): Promise<boolean> {
  const { isNewVersion, currentVersion, storedVersion } = checkForNewVersion()

  if (isNewVersion) {
    console.log('🆕 New version detected!')
    console.log('Previous:', storedVersion)
    console.log('Current:', currentVersion)

    // Clear only specific caches that might be outdated
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys()
        await Promise.all(
          cacheNames.map((cacheName) => {
            // Only clear app-specific caches, keep others
            if (cacheName.includes('wanappo-game') || cacheName.includes('workbox')) {
              return caches.delete(cacheName)
            }
          }),
        )
        console.log('✅ Old caches cleared for new version')
      } catch (error) {
        console.error('❌ Failed to clear old caches:', error)
      }
    }

    // Store new version
    storeCurrentVersion()
    return true
  }

  return false
}

/**
 * Initialize version checking on app start
 */
export function initVersionCheck(): void {
  // Check version on app start
  handleVersionChange().then((wasNewVersion) => {
    if (wasNewVersion) {
      console.log('🔄 App updated to new version, caches refreshed')
    } else {
      console.log('✅ Same version, using cached resources')
    }
  })
}

/**
 * Get build info for debugging
 */
export function getBuildInfo(): Record<string, unknown> {
  return {
    version: getAppVersion(),
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    mode: import.meta.env.MODE,
    baseUrl: import.meta.env.BASE_URL,
    buildDate: new Date().toISOString(),
  }
}
