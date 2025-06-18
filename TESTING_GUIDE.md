# Testing Cache-Busting Implementation

This guide shows you **exactly how to test** that the cache-busting strategy is working correctly.

## 🧪 **Testing Strategy**

We'll test both scenarios:

1. **New deployment** → Browser ignores cache, downloads fresh files
2. **Same deployment** → Browser uses cached files for performance

## 📋 **Pre-Test Setup**

### 1. Install Dependencies

```bash
npm install cross-env --save-dev
```

### 2. Build Locally First

```bash
# Test the build with version injection
npm run build-with-version

# Check the output
ls -la dist/assets/
```

You should see files like:

```
main-a1b2c3d4.js
vue-vendor-e5f6g7h8.js
styles-i9j0k1l2.css
```

## 🔍 **Test 1: Verify File Hashing Works**

### Step 1: Initial Build

```bash
npm run build-with-version
ls dist/assets/ > build1.txt
cat build1.txt
```

### Step 2: Make a Small Code Change

Edit any Vue file, for example `src/App.vue`:

```vue
<!-- Add a comment or change any text -->
<template>
  <RouterView />
  <CacheDevTools />
  <!-- Testing cache busting 2025 -->
</template>
```

### Step 3: Rebuild and Compare

```bash
npm run build-with-version
ls dist/assets/ > build2.txt

# Compare the files
echo "=== BUILD 1 ==="
cat build1.txt
echo "=== BUILD 2 ==="
cat build2.txt
echo "=== DIFF ==="
diff build1.txt build2.txt
```

**Expected Result:** Only files containing your changed code should have different hashes.

## 🌐 **Test 2: Live Deployment Testing**

### Step 1: Deploy Current Version

```bash
git add .
git commit -m "Test: Initial deployment for cache testing"
git push origin main
```

### Step 2: Monitor the Build

1. Go to GitHub → Actions tab
2. Watch the deployment process
3. Note the build number and commit hash

### Step 3: Test in Browser (First Load)

1. Open your deployed app: `https://[username].github.io/wanappo-game-credelio/`
2. **Open DevTools** (F12)
3. Go to **Network** tab
4. **Disable cache** checkbox (for this test only)
5. Refresh the page
6. **Note the file names** in Network tab:
   ```
   main-a1b2c3d4.js
   vue-vendor-e5f6g7h8.js
   styles-i9j0k1l2.css
   ```

### Step 4: Make a Code Change and Deploy

```bash
# Edit a file, for example src/views/GameHomeView.vue
# Add a comment or change some text

git add .
git commit -m "Test: Code change for cache busting verification"
git push origin main
```

### Step 5: Test Cache Busting (New Deployment)

1. **Wait for deployment to complete** (check GitHub Actions)
2. In browser, **enable cache** again (check the "Disable cache" checkbox OFF)
3. **Clear DevTools Network log** (🚫 icon)
4. **Refresh the page**
5. **Check Network tab**:

**Expected Results:**

- ✅ Files with your changes should have **new hashes**
- ✅ Unchanged files should have **same hashes**
- ✅ Browser should download **only files with new hashes**
- ✅ Cached files should show **(from disk cache)** or **(from memory cache)**

Example:

```
✅ main-x9y8z7w6.js          ← New hash (your code changed)
✅ vue-vendor-e5f6g7h8.js    ← Same hash (Vue didn't change)
✅ styles-i9j0k1l2.css       ← Same hash (CSS didn't change)
```

## 🔧 **Test 3: Version Detection Testing**

### Step 1: Check Console Logs

1. Open your deployed app
2. **Open DevTools Console**
3. Look for version detection logs:
   ```
   🚀 Production mode: Smart cache management enabled
   🏗️ Build info: { version: "123", buildHash: "abc1234", ... }
   ```

### Step 2: Manual Version Check

In the browser console, run:

```javascript
// Check current version
const version = localStorage.getItem('app-version')
console.log('Stored version:', JSON.parse(version))

// Check if new version detection works
import('./src/utils/version.js').then((module) => {
  const info = module.getBuildInfo()
  console.log('Current build info:', info)
})
```

## 🏃‍♂️ **Test 4: Quick Local Testing**

### Using Local Server

```bash
# Build and serve locally
npm run build-with-version
npm run preview

# Open browser to http://localhost:4173/wanappo-game-credelio/
```

### Test Cache Headers

```bash
# Test cache headers with curl
curl -I http://localhost:4173/wanappo-game-credelio/

# Should show cache-friendly headers like:
# Cache-Control: public, max-age=31536000, must-revalidate
```

## 📊 **Test 5: Performance Testing**

### Measure Cache Effectiveness

1. **First visit** (cold cache):

   - Open Network tab
   - Hard refresh (Ctrl+Shift+R)
   - Note total download size and time

2. **Second visit** (warm cache):

   - Normal refresh (F5)
   - Check how many files come from cache
   - Compare download size and time

3. **After deployment** (new version):
   - Deploy a change
   - Normal refresh
   - Verify only changed files are downloaded

## 🐛 **Troubleshooting Tests**

### If Files Don't Have Hashes

```bash
# Check Vite config
npm run build-only -- --debug

# Verify build output
cat dist/.vite/manifest.json
```

### If Cache Isn't Working

```bash
# Check server headers
curl -I https://[username].github.io/wanappo-game-credelio/

# Check if GitHub Pages is serving correct headers
```

### If Version Detection Fails

```bash
# Check environment variables in build
npm run build-with-version
grep -r "VITE_" dist/
```

## ✅ **Success Criteria**

Your cache-busting is working correctly when:

1. **File Hashing**: ✅ Files have content-based hashes (`main-abc123.js`)
2. **Selective Updates**: ✅ Only changed files get new hashes
3. **Browser Behavior**: ✅ Cached files show "(from cache)" in DevTools
4. **New Deployments**: ✅ Changed files are downloaded fresh
5. **Version Detection**: ✅ Console shows version comparison logs
6. **Performance**: ✅ Subsequent visits are faster (using cache)

## 🎯 **Real-World Test Scenario**

### Complete End-to-End Test:

1. **Deploy** → `git push origin main`
2. **Visit app** → Note file hashes in DevTools
3. **Make change** → Edit any Vue component
4. **Deploy again** → `git push origin main`
5. **Revisit app** → Verify selective file updates
6. **No changes** → Visit app again, verify cache usage

**Expected:** Only the files you actually changed should be re-downloaded! 🎉

## 📝 **Test Checklist**

- [ ] Local build produces hashed filenames
- [ ] GitHub Actions deployment includes version variables
- [ ] Browser downloads only changed files on new deployment
- [ ] Browser uses cache for unchanged files
- [ ] Version detection logs appear in console
- [ ] Performance improves on repeat visits
- [ ] No unnecessary cache clearing occurs
