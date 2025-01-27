import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', 
    PORT:"5173",// Bind to all available network interfaces
  },
  plugins: [react()],
})
