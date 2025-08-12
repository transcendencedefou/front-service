import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [vue()],
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 3004,
    strictPort: true,
    allowedHosts: ['front-service', 'localhost', '127.0.0.1'],
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3004
    },
    watch: {
      ignored: ['**/node_modules/**', '**/dist/**', '**/coverage/**', '**/.cache/**', '**/logs/**', '**/tmp/**'],
      usePolling: true,
      interval: 1000
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
    }
  }
})
