import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@/types': path.resolve(__dirname, '../../packages/types/src'),
      '@/utils': path.resolve(__dirname, '../../packages/utils/src'),
    }
  },
  server: {
    port: 3001,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})