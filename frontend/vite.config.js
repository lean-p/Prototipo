import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { 
    proxy: {
      // Backend APIs
      '/api/tracks': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        cookieDomainRewrite: "localhost",
        ws: true,
      },
      '/api/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        cookieDomainRewrite: "localhost",
        ws: true,
      },
      '/api/info': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        cookieDomainRewrite: "localhost",
        ws: true,
      },
      '/api/alertas': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        cookieDomainRewrite: "localhost",
        ws: true,
      },
      '/api/dashboard': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        cookieDomainRewrite: "localhost",
        ws: true,
      }
    },
    resolve: {
    alias: {
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    }
  }
  }
})


