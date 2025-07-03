import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173, // Frontend PORT
    
    // DEVELOPMENT: Proxy was use instead of .env in FrontEnd
    // proxy: {
    //   '/HeroTasks': {
    //     target: 'http://localhost:3001', // Backend URL. PORT: 3001
    //     changeOrigin: true,
    //     secure: false,
    //     //rewrite: (path) => path.replace(/^\/HeroTasks/, '')
    //   },
    // }
  }

});