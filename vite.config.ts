import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import svgLoader from 'vite-svg-loader'
import { compression } from 'vite-plugin-compression2'

// https://vite.dev/config/
export default defineConfig({
  base: '/wanappo-game-credelio/',
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    svgLoader({
      svgoConfig: {
        multipass: true,
      },
    }),
    compression({
      algorithms: ['gzip', 'brotliCompress'],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // Disable caching ONLY in development
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  },
  build: {
    // Generate manifest for cache strategies
    manifest: true,
    // Optimize chunk splitting for better caching
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Use content hash for cache busting - files change hash only when content changes
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Special handling for different asset types
          if (!assetInfo.name) return 'assets/[name]-[hash].[ext]'
          
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          
          // Images and fonts get hash in filename for long-term caching
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash].[ext]`
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash].[ext]`
          }
          // CSS and other assets
          return `assets/[name]-[hash].[ext]`
        },
        // Split vendor chunks for better caching
        manualChunks: (id) => {
          // Vendor chunk for node_modules
          if (id.includes('node_modules')) {
            // Further split large vendors
            if (id.includes('vue') || id.includes('pinia') || id.includes('@vue')) {
              return 'vue-vendor'
            }
            return 'vendor'
          }
        }
      }
    }
  }
})
