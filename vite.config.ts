import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vitejs.dev/config/
// `base` is set for GitHub Pages (served under /<repo>/); dev stays at '/'.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/V-LORA-HOTELS-RESORTS/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}))
