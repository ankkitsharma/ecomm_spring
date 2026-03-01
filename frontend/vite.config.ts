import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tanstackStart(),
    nitro(),
    react(),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
})
