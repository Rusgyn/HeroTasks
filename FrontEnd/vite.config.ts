import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // This allow external access, This is useful for testing on different devices within the same network or for allowing others on the same network to access your development server.
    // - `http://localhost:5173`
    // - `http://127.0.0.1:5173`
    // - `http://192.x.x.x:5173`
    port: 5173, // Frontend PORT

    proxy: {
      '/HeroTasks': { // /HeroTasks: All requests starting with /HeroTasks in Frontend will be proxied to the Backend server (http://localhost:3001). Ex: /HeroTasks/Hey, the Vite proxy will forward the request to http://localhost:3001/HeroTasks/Hey
        target: 'http://localhost:3001', // Backend URL. PORT: 3001
        changeOrigin: true,
        secure: false,
      },
    }


  }
})
