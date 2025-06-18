// Browser Console Testing Script for Cache Busting
// Copy and paste this into your browser's DevTools Console
// when testing your deployed app

console.log('🧪 Cache Busting Browser Test');
console.log('===============================');

// Test 1: Check current version information
async function checkVersion() {
    console.log('\n📋 Version Information:');
    
    // Get stored version from localStorage
    const storedVersion = localStorage.getItem('app-version');
    if (storedVersion) {
        console.log('Stored version:', JSON.parse(storedVersion));
    } else {
        console.log('No stored version found');
    }
    
    // Get build info (if available)
    try {
        const buildInfo = {
            isDev: typeof import.meta !== 'undefined' && import.meta.env?.DEV,
            isProd: typeof import.meta !== 'undefined' && import.meta.env?.PROD,
            mode: typeof import.meta !== 'undefined' && import.meta.env?.MODE,
            baseUrl: typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
        };
        console.log('Build info:', buildInfo);
    } catch (e) {
        console.log('Build info not accessible from console');
        console.error(e.message);
    }
}

// Test 2: Analyze current page resources
function analyzeResources() {
    console.log('\n📦 Current Page Resources:');
    
    const resources = performance.getEntriesByType('resource');
    const jsFiles = resources.filter(r => r.name.includes('.js'));
    const cssFiles = resources.filter(r => r.name.includes('.css'));
    
    console.log('\n🟡 JavaScript Files:');
    jsFiles.forEach(file => {
        const filename = file.name.split('/').pop();
        const fromCache = file.transferSize === 0 ? '(from cache)' : '(downloaded)';
        const size = file.transferSize > 0 ? `${Math.round(file.transferSize/1024)}KB` : 'cached';
        console.log(`  ✅ ${filename} - ${size} ${fromCache}`);
    });
    
    console.log('\n🟢 CSS Files:');
    cssFiles.forEach(file => {
        const filename = file.name.split('/').pop();
        const fromCache = file.transferSize === 0 ? '(from cache)' : '(downloaded)';
        const size = file.transferSize > 0 ? `${Math.round(file.transferSize/1024)}KB` : 'cached';
        console.log(`  ✅ ${filename} - ${size} ${fromCache}`);
    });
}

// Test 3: Check if files have proper hashes
function checkFileHashes() {
    console.log('\n🔐 File Hash Analysis:');
    
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const links = Array.from(document.querySelectorAll('link[href]'));
    
    console.log('\n📄 Script files:');
    scripts.forEach(script => {
        const src = script.src;
        const filename = src.split('/').pop();
        const hasHash = /-[a-f0-9]{8,}\.js$/.test(filename);
        console.log(`  ${hasHash ? '✅' : '❌'} ${filename} ${hasHash ? '(hashed)' : '(not hashed)'}`);
    });
    
    console.log('\n📄 CSS files:');
    links.forEach(link => {
        if (link.rel === 'stylesheet') {
            const href = link.href;
            const filename = href.split('/').pop();
            const hasHash = /-[a-f0-9]{8,}\.css$/.test(filename);
            console.log(`  ${hasHash ? '✅' : '❌'} ${filename} ${hasHash ? '(hashed)' : '(not hashed)'}`);
        }
    });
}

// Test 4: Test cache clearing functionality
function testCacheClear() {
    console.log('\n🧹 Cache Clearing Test:');
    
    // Test localStorage clearing
    const beforeCount = localStorage.length;
    console.log(`LocalStorage items before: ${beforeCount}`);
    
    if (beforeCount > 0) {
        console.log('LocalStorage items:');
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            console.log(`  - ${key}`);
        }
    }
    
    // Test if cache utilities are available
    if (typeof clearAllLocalStorage !== 'undefined') {
        console.log('✅ Cache utilities are available');
    } else {
        console.log('❌ Cache utilities not available in global scope');
    }
}

// Test 5: Performance analysis
function analyzePerformance() {
    console.log('\n⚡ Performance Analysis:');
    
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
        console.log(`Page load time: ${Math.round(navigation.loadEventEnd - navigation.fetchStart)}ms`);
        console.log(`DOM ready: ${Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart)}ms`);
        console.log(`First paint: ${Math.round(navigation.responseEnd - navigation.fetchStart)}ms`);
    }
    
    const resources = performance.getEntriesByType('resource');
    const totalSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
    const cachedResources = resources.filter(r => r.transferSize === 0).length;
    
    console.log(`Total resources: ${resources.length}`);
    console.log(`Cached resources: ${cachedResources}`);
    console.log(`Total downloaded: ${Math.round(totalSize/1024)}KB`);
    console.log(`Cache hit ratio: ${Math.round((cachedResources/resources.length)*100)}%`);
}

// Run all tests
async function runAllTests() {
    console.log('🚀 Running all cache busting tests...\n');
    
    await checkVersion();
    analyzeResources();
    checkFileHashes();
    testCacheClear();
    analyzePerformance();
    
    console.log('\n🎯 Test Instructions:');
    console.log('1. Note the current file hashes above');
    console.log('2. Wait for a new deployment (with code changes)');
    console.log('3. Refresh this page normally (F5)');
    console.log('4. Run this script again: runAllTests()');
    console.log('5. Compare the results - changed files should have new hashes');
    console.log('\n✅ Tests completed!');
}

// Make functions available globally
window.checkVersion = checkVersion;
window.analyzeResources = analyzeResources;
window.checkFileHashes = checkFileHashes;
window.testCacheClear = testCacheClear;
window.analyzePerformance = analyzePerformance;
window.runAllTests = runAllTests;

// Auto-run tests
runAllTests();
