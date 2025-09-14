import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '');
  
  // Check if we're in production mode
  const isProduction = mode === 'production';
  
  return {
    // Set the base URL for GitHub Pages
    base: isProduction ? '/vu-cake-factory/' : '/',
    
    // Configure plugins
    plugins: [react()],
    
    // Optimize dependencies
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    
    // Configure the dev server
    server: {
      port: 5173,
      strictPort: true,
      proxy: !isProduction ? {
        // Proxy configuration for local development
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
    
    // Build configuration for production
    build: {
      outDir: 'dist',
      sourcemap: isProduction ? false : 'inline',
      minify: isProduction ? 'esbuild' : false,
      // Ensure static assets are copied to the build folder
      assetsDir: 'assets',
      // Configure chunk size warnings
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor and app code
            vendor: ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
    },
    
    // Configure environment variables to be exposed to the client
    define: {
      'process.env': {}
    },
    
    // Configure preview server (for production build testing)
    preview: {
      port: 4173,
      strictPort: true,
    },
  };
});
