import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Pin the port: the API's CORS policy (Cors:ClientOrigin in
    // api/appsettings.json) allows exactly http://localhost:5180.
    // strictPort makes Vite fail loudly instead of silently picking another port.
    // (5180 rather than Vite's default 5173, so it won't clash with other Vite projects.)
    port: 5180,
    strictPort: true,
  },
})
