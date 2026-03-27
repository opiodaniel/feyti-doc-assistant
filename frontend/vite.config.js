import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  // Ensure the build target is compatible with import.meta
  build: {
    target: 'esnext'
  }
})