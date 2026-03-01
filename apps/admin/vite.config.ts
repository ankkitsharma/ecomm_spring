import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    TanStackRouterVite(),
    react(),
  ],
  server: {
    host: '0.0.0.0',
    port: 3002,
  },
})
