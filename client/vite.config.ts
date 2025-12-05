import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 4000,
    allowedHosts: ["expense-tracker.com.br", "www.expense-tracker.com.br"]
  }
})
