import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Where the dev proxy forwards /api requests (the auth service).
  const proxyTarget = env.AUTH_PROXY_TARGET || 'http://localhost:3008'

  return {
    plugins: [react()],
    server: {
      // Proxy same-origin /api calls to the auth service so the browser treats
      // the auth cookie as first-party (avoids cross-site SameSite issues in dev).
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
