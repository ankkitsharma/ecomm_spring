import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { nitro } from 'nitro/vite'

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    TanStackRouterVite({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    tanstackStart(),
    nitro(),
    react(),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
})
