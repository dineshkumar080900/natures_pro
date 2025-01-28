import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    host: '0.0.0.0', // Make the server externally accessible
    port: 5173, // Use Render's PORT environment variable
  },
  plugins: [react()],
})
