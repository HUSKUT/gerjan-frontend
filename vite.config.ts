import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

dotenv.config(); // load env vars from .env

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
  define: {
    BACKEND_URL: `"${process.env.VALUE}"`,
  },
  plugins: [react()],
})
