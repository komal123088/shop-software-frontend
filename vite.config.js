import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import os from 'os'

// Helper to get local IP address
function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip internal and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

export default defineConfig(({ mode }) => {
  // Load env variables
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  
  // Get the actual local IP dynamically
  const networkIP = getLocalIP()
  
  // Get port from env or use default
  const backendPort = env.VITE_BACKEND_PORT || 3000
  
  // Construct URLs for both localhost and network
  const localBackendURL = `http://localhost:${backendPort}`
  const networkBackendURL = `http://${networkIP}:${backendPort}`
  
  const localApiBase = `${localBackendURL}/api`
  const networkApiBase = `${networkBackendURL}/api`

  // Detect if running in Electron
  const isElectron = process.env.ELECTRON === 'true' || mode === 'electron';

  console.log('\n=================================')
  console.log('🚀 Vite Configuration:')
  console.log('📡 Network IP:', networkIP)
  console.log('🏠 Local Backend:', localBackendURL)
  console.log('🌍 Network Backend:', networkBackendURL)
  console.log('⚡ Electron Mode:', isElectron ? 'YES' : 'NO')
  console.log('=================================\n')

  return {
    plugins: [react()],
    base: './',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: 'index.html',
        },
      },
      // Ensure assets are properly referenced in Electron
      assetsDir: 'assets',
    },
    server: {
      host: true, // Listen on all network interfaces
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: localBackendURL,
          changeOrigin: true,
          secure: false
        },
        '/uploads': {
          target: localBackendURL,
          changeOrigin: true,
          secure: false
        }
      }
    },
    define: {
      // Pass environment variables to frontend
      'import.meta.env.VITE_LOCAL_IP': JSON.stringify(networkIP),
      'import.meta.env.VITE_LOCAL_BACKEND': JSON.stringify(localBackendURL),
      'import.meta.env.VITE_NETWORK_BACKEND': JSON.stringify(networkBackendURL),
      'import.meta.env.VITE_LOCAL_API': JSON.stringify(localApiBase),
      'import.meta.env.VITE_NETWORK_API': JSON.stringify(networkApiBase),
      'import.meta.env.VITE_BACKEND_PORT': JSON.stringify(backendPort),
      'import.meta.env.VITE_IS_ELECTRON': JSON.stringify(isElectron)
    }
  }
})