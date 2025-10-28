import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

// Vite config for static site with PDF.js worker support
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['pdfjs-dist'],
  },
  resolve: {
    alias: {
      'pdfjs-dist': path.resolve(__dirname, 'node_modules/pdfjs-dist'),
    },
  },
  server: { host: '127.0.0.1', port: 5173, strictPort: false },
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: ''
  },
  css: {
    devSourcemap: false, // Disable sourcemaps completely
    preprocessorOptions: {
      scss: {
        quietDeps: true, // Reduce SCSS deprecation warnings
        logger: {
          warn: () => {} // Silence SCSS warnings
        }
      }
    }
  }
});
