import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': `${import.meta.dirname}/src`,
      '@components': `${import.meta.dirname}/src/components`,
      '@sections': `${import.meta.dirname}/src/sections`,
      '@pages': `${import.meta.dirname}/src/pages`,
      '@hooks': `${import.meta.dirname}/src/hooks`,
      '@utils': `${import.meta.dirname}/src/utils`,
      '@styles': `${import.meta.dirname}/src/styles`,
      '@assets': `${import.meta.dirname}/src/assets`,
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // Rolldown (Vite 8 bundler) handles code-splitting automatically via
    // dynamic imports. manualChunks is not yet supported in rolldown.
    // Lazy imports (React.lazy) in App.jsx and HeroSection.jsx will create
    // separate async chunks for Three.js vendor libs automatically.
    sourcemap: false,
    minify: true,
  },
})
