import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { navigationApi } from './server/navigation-api.mjs'
// The browser's Origin is this front's domain, which the backend CORS list does not allow.
// Requests through this proxy are same-origin for the browser, so drop it before forwarding.
const dropOrigin = (proxy: any) => proxy.on('proxyReq', (req: any) => req.removeHeader('origin'))
export default defineConfig(({ mode }) => ({
  plugins: [vue(), navigationApi(loadEnv(mode, '.', ''))],
  server: {
    host: 'localhost',
    port: 8282,
    strictPort: true,
    proxy: {
      '/tunnel-source': {
        target: 'https://seoultunnel.co.kr',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/tunnel-source/, '/usage'),
      },
      '/control/plate': {
        target: loadEnv(mode, '.', '').AI_SERVER_URL || 'http://localhost:8000',
        changeOrigin: true,
        headers: { 'X-Internal-Api-Key': loadEnv(mode, '.', '').INTERNAL_API_KEY || '' },
      },
      '/api': {
        target: loadEnv(mode, '.', '').BACKEND_URL || 'http://localhost:5555',
        changeOrigin: true,
        timeout: 0,
        proxyTimeout: 0,
      },
    },
  },
  preview: {
    host: 'localhost',
    port: 8282,
    strictPort: true,
    allowedHosts: ['.onrender.com'],
    proxy: {
      '/tunnel-source': {
        target: 'https://seoultunnel.co.kr',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/tunnel-source/, '/usage'),
      },
      '/control/plate': {
        target: loadEnv(mode, '.', '').AI_SERVER_URL || 'http://localhost:8000',
        changeOrigin: true,
        configure: dropOrigin,
        headers: { 'X-Internal-Api-Key': loadEnv(mode, '.', '').INTERNAL_API_KEY || '' },
      },
      '/api': {
        target: loadEnv(mode, '.', '').BACKEND_URL || 'http://localhost:5555',
        changeOrigin: true,
        timeout: 0,
        proxyTimeout: 0,
        configure: dropOrigin,
      },
    },
  },
}))
