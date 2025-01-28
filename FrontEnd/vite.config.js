import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.VITE_PORT) || 1000, // Use VITE_PORT or default to 5173
  },
  plugins: [react()],
})
