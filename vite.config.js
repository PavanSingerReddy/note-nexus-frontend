import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server:{
    host: true,
    port:5000
  },
  preview:{
    port : 5000
  },
  plugins: [react()],
})
