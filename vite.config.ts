import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  build: {
    cssMinify: 'esbuild', // Future-proofing your Vercel deployment!
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})