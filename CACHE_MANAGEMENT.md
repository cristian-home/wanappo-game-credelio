# Cache Management Guide

This document explains the **smart cache-busting strategy** implemented for production deployments, ensuring that browsers load fresh content **only when there's a new build**, while still benefiting from cache performance for unchanged content.

## 🎯 **Strategy Overview**

### ✅ **What Happens on New Deployment**

- Browser automatically detects new build via **content-based hashes**
- Only changed files are re-downloaded
- Cache API is intelligently cleared for outdated resources
- Version detection triggers targeted cache cleanup

### ✅ **What Happens on Same Build**

- Browser uses cached resources for optimal performance
- No unnecessary downloads or cache clearing
- Fast loading times maintained

## 🔧 **Implementation Details**

### 1. **Content-Based File Hashing** (Primary Strategy)

**Vite Configuration (`vite.config.ts`):**

```typescript
build: {
  rollupOptions: {
    output: {
      // Files get new hash ONLY when content changes
      entryFileNames: 'assets/[name]-[hash].js',
      chunkFileNames: 'assets/[name]-[hash].js',
      assetFileNames: 'assets/[name]-[hash].[ext]'
    }
  }
}
```

**How it works:**

- `main-abc123.js` → Changes to `main-def456.js` only when code changes
- `styles-xyz789.css` → Hash changes only when CSS changes
- Browser automatically fetches new files when hash changes
- Unchanged files keep same hash = browser uses cache

### 2. **Smart Chunk Splitting**

**Optimized caching strategy:**

```typescript
manualChunks: (id) => {
  if (id.includes('vue') || id.includes('pinia')) {
    return 'vue-vendor' // Rarely changes
  }
  if (id.includes('node_modules')) {
    return 'vendor' // Stable across deployments
  }
  // Your app code in separate chunks
}
```

**Benefits:**

- Vendor libraries cached long-term (rarely change)
- App code in separate chunks (changes more frequently)
- Users only download what actually changed

### 3. **Version Detection System**

**Automatic new build detection (`src/utils/version.ts`):**

```typescript
// Detects new builds automatically
export function checkForNewVersion() {
  const currentVersion = {
    version: import.meta.env.VITE_APP_VERSION,
    buildHash: import.meta.env.VITE_BUILD_HASH,
    buildTime: import.meta.env.VITE_BUILD_TIME,
  }
  // Compare with stored version
}
```

**Build-time version injection:**

```bash
# In GitHub Actions or build script
export VITE_BUILD_HASH=${{ github.sha }}
export VITE_BUILD_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)
npm run build
```

clearAllLocalStorage()

// Clear only Pinia stores
clearAllPiniaStores()

// Force page reload bypassing cache
forceReload()

// Clear everything (localStorage, sessionStorage, Cache API)
await clearEverything()

````

### Store-Specific Clearing

```typescript
import { useGameStore } from '@/stores/game'
import { useLanguageStore } from '@/stores/language'

const gameStore = useGameStore()
const languageStore = useLanguageStore()

// Clear individual stores
gameStore.clearPersistedState()
languageStore.clearPersistedState()
````

## Browser Developer Tools

### Force Refresh Methods

1. **Ctrl+F5** (Windows/Linux) or **Cmd+Shift+R** (Mac) - Hard refresh
2. **F12 → Network tab → Disable cache checkbox** - Disable cache while DevTools open
3. **F12 → Application tab → Storage → Clear storage** - Clear all storage

### Chrome DevTools

- Go to DevTools → Application → Storage → Local Storage → Clear All
- Use "Empty Cache and Hard Reload" (right-click refresh button)

## Cache Strategies by Environment

### Development

- All caches disabled by default
- Development tools panel available
- Console logging enabled
- Automatic cache busting timestamps

### Production

- Normal caching behavior for performance
- Manual cache clearing utilities available
- No development tools panel
- Optimized file naming for cache busting

## File Structure

```
src/
├── utils/
│   └── cache.ts                 # Cache management utilities
├── components/
│   └── Dev/
│       └── CacheDevTools.vue    # Development cache tools panel
└── stores/
    ├── game.ts                  # Game store with clearPersistedState()
    └── language.ts              # Language store with clearPersistedState()
```

## Troubleshooting

### Cache Not Clearing

1. Check browser developer tools for any errors
2. Manually clear browser data via browser settings
3. Try incognito/private browsing mode
4. Use the development tools panel for step-by-step clearing

### Pinia State Persisting

1. Check if `localStorage.clear()` is working
2. Verify the store names match in `clearAllPiniaStores()`
3. Use individual store `clearPersistedState()` methods

### Still Seeing Old Content

1. Clear Service Worker cache (if any)
2. Check for cached files in browser cache
3. Use cache-busting query parameters
4. Clear CDN cache if using one

## Best Practices

1. **Development**: Use `npm run dev:fresh` for a clean start
2. **Testing**: Clear caches between test scenarios
3. **Deployment**: Use proper cache headers for production
4. **Debugging**: Enable console logging to see cache operations
5. **User Experience**: Provide cache clear options for users when needed

### 4. **GitHub Actions Integration**

**Example deployment workflow (`.github/workflows/deploy.yml.example`):**

```yaml
- name: Build with version info
  run: |
    export VITE_APP_VERSION=${{ github.run_number }}
    export VITE_BUILD_HASH=${{ github.sha }}
    export VITE_BUILD_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    npm run build-only
```

## 📋 **Deployment Examples**

### Example 1: Same Build

```
Previous deployment: main-abc123.js, styles-xyz789.css
New deployment:     main-abc123.js, styles-xyz789.css
Result: Browser uses cached files ✅ (Fast loading)
```

### Example 2: Code Change

```
Previous deployment: main-abc123.js, styles-xyz789.css
New deployment:     main-def456.js, styles-xyz789.css
Result: Downloads only main-def456.js ✅ (Partial update)
```

### Example 3: CSS Change

```
Previous deployment: main-abc123.js, styles-xyz789.css
New deployment:     main-abc123.js, styles-uvw456.css
Result: Downloads only styles-uvw456.css ✅ (Targeted update)
```

## 🛠️ **Development vs Production**

### Development Mode

- **Cache**: Disabled completely for rapid iteration
- **Files**: No hashing, easier debugging
- **Tools**: Development panel available (🛠️ button)
- **Logging**: Verbose console output

### Production Mode

- **Cache**: Smart content-based caching
- **Files**: Hashed filenames for cache busting
- **Tools**: No development panel
- **Logging**: Version detection only

## 📦 **Build Commands**

```bash
# Development
npm run dev          # Normal development
npm run dev:fresh    # Force cache clear

# Production Build
npm run build                # Standard build
npm run build-with-version   # Build with version injection

# Cache Management
npm run clear-cache         # Clear build caches
```

## 🔍 **Verification**

### Check if Cache Busting Works:

1. **Build your app**: `npm run build`
2. **Check dist folder**: Look for hashed filenames
   ```
   dist/assets/
   ├── main-abc123.js
   ├── vue-vendor-def456.js
   └── styles-xyz789.css
   ```
3. **Make a code change and rebuild**
4. **Verify**: Only changed files get new hashes

### Monitor in Browser:

1. **Open DevTools** → Network tab
2. **Deploy new version**
3. **Check**: Only files with new hashes are downloaded
4. **Console**: Look for version detection logs

## 🚀 **Best Practices**

### For Optimal Caching:

1. ✅ **Keep vendor libraries stable** (separate chunks)
2. ✅ **Split app code logically** (route-based chunks)
3. ✅ **Use version detection** (automatic cache management)
4. ✅ **Monitor bundle sizes** (chunk size warnings)

### For Development:

1. ✅ **Use `dev:fresh`** for clean starts
2. ✅ **Enable development tools** (cache panel)
3. ✅ **Check console logs** (version info)

### For Deployment:

1. ✅ **Set environment variables** (version, hash, time)
2. ✅ **Use proper build command** (`build-with-version`)
3. ✅ **Verify hash changes** (only when needed)

## 🔧 **Technical Implementation**

### Files Modified:

- `vite.config.ts` - Content-based hashing, chunk splitting
- `src/utils/version.ts` - Version detection system
- `src/main.ts` - Automatic version checking
- `package.json` - Build scripts with version injection
- `index.html` - Production-friendly cache headers

### Key Technologies:

- **Vite**: Content-based file hashing
- **Rollup**: Manual chunk splitting
- **Environment Variables**: Build-time version injection
- **Cache API**: Targeted cache clearing
- **LocalStorage**: Version comparison

This approach ensures **maximum performance** (cache when possible) while guaranteeing **fresh content** (when actually needed) for your GitHub Pages deployments! 🎯
