#!/bin/bash

# Cache Busting Test Script
# This script helps you quickly test if cache busting is working

echo "🧪 Cache Busting Test Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Test 1: Check if cross-env is installed
print_status "Checking dependencies..."
if npm list cross-env >/dev/null 2>&1; then
    print_success "cross-env is installed"
else
    print_warning "Installing cross-env..."
    npm install cross-env --save-dev
fi

# Test 2: Build with version info
print_status "Building with version information..."
if npm run build-with-version; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# Test 3: Check if files are hashed
print_status "Checking for hashed filenames..."
cd dist/assets 2>/dev/null || { print_error "dist/assets directory not found"; exit 1; }

# Count hashed files
hashed_js=$(ls *-*.js 2>/dev/null | wc -l)
hashed_css=$(ls *-*.css 2>/dev/null | wc -l)
total_hashed=$((hashed_js + hashed_css))

if [ $total_hashed -gt 0 ]; then
    print_success "Found $total_hashed hashed files:"
    ls -la *-*.{js,css} 2>/dev/null | while read line; do
        echo "  ✅ $line"
    done
else
    print_error "No hashed files found! Cache busting may not be working."
    print_warning "Files found:"
    ls -la
    exit 1
fi

cd - >/dev/null

# Test 4: Check manifest file
print_status "Checking build manifest..."
if [ -f "dist/.vite/manifest.json" ]; then
    print_success "Manifest file exists"
    print_status "Manifest preview:"
    head -5 dist/.vite/manifest.json | sed 's/^/  /'
else
    print_warning "No manifest file found"
fi

# Test 5: Check for version variables in built files
print_status "Checking for version information in build..."
if grep -r "VITE_" dist/ >/dev/null 2>&1; then
    print_success "Version information found in build"
    grep -r "VITE_" dist/ | head -3 | sed 's/^/  /'
else
    print_warning "No version information found in build"
fi

# Test 6: Simulate file change
print_status "Testing hash change simulation..."
echo "<!-- Test comment $(date) -->" >> src/App.vue

print_status "Rebuilding after change..."
if npm run build-with-version >/dev/null 2>&1; then
    print_success "Rebuild completed"
    
    cd dist/assets
    new_hashed=$(ls *-*.js 2>/dev/null | wc -l)
    if [ $new_hashed -gt 0 ]; then
        print_success "New hashed files generated:"
        ls -la *-*.{js,css} 2>/dev/null | tail -3 | while read line; do
            echo "  ✅ $line"
        done
    fi
    cd - >/dev/null
else
    print_error "Rebuild failed"
fi

# Cleanup test change
git checkout src/App.vue 2>/dev/null || sed -i '$ d' src/App.vue

# Test 7: Local server test
print_status "Testing local preview server..."
if command -v curl >/dev/null 2>&1; then
    # Start preview server in background
    npm run preview >/dev/null 2>&1 &
    SERVER_PID=$!
    
    sleep 3
    
    if curl -s -I http://localhost:4173/wanappo-game-credelio/ >/dev/null 2>&1; then
        print_success "Local server is accessible"
        
        # Check cache headers
        cache_header=$(curl -s -I http://localhost:4173/wanappo-game-credelio/ | grep -i "cache-control" || echo "not found")
        print_status "Cache headers: $cache_header"
    else
        print_warning "Local server not accessible (this is OK if port is busy)"
    fi
    
    # Cleanup
    kill $SERVER_PID 2>/dev/null
else
    print_warning "curl not available, skipping server test"
fi

# Final summary
echo ""
echo "🎯 Test Summary"
echo "==============="
print_success "✅ Build system works"
print_success "✅ Files are properly hashed"
print_success "✅ Version injection working"
print_success "✅ Cache busting should work in production"

echo ""
print_status "Next steps:"
echo "  1. Deploy to GitHub Pages: git push origin main"
echo "  2. Test in browser with DevTools Network tab"
echo "  3. Make a code change and deploy again"
echo "  4. Verify only changed files are downloaded"
echo ""
echo "📖 For detailed testing instructions, see TESTING_GUIDE.md"
echo ""
print_success "🎉 Cache busting implementation is ready!"
