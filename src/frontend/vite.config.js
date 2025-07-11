import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react({
        include: '**/*.{jsx,js}',
      }),
    ],
    server: {
      port: 4000,
      proxy: {
        '/api': {
          target: 'http://localhost:5001',
          changeOrigin: true,
          secure: false,
        }
      },
      watch: {
        ignored: ['**/node_modules/**', '**/dist/**', '**/EthicalHackingLMS/**']
      }
    },
    esbuild: {
      loader: 'jsx',
      include: ['src/**/*.js', 'src/**/*.jsx'],
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      // Generate manifest.json in the build output
      manifest: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            mui: ['@mui/material', '@mui/icons-material'],
          }
        }
      }
    },
    define: {
      // Make environment variables available to the client
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || ''),
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    }
  }
})
