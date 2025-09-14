import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    base: isProduction ? '/vu-cake-factory/' : '/',
    plugins: [react()],
    
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    
    server: {
      port: 5173,
      strictPort: true,
      proxy: !isProduction ? {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        }
      } : undefined,
    },
    
    build: {
      outDir: 'dist',
      sourcemap: isProduction ? false : 'inline',
      minify: isProduction ? 'esbuild' : false,
      assetsDir: 'assets',
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom']
          }
        }
      },
      assetsInlineLimit: 0
    },
    
    preview: {
      port: 4173,
      strictPort: true
    }
  };
});
