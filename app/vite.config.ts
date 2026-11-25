import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist/client', emptyOutDir: true },
  server: {
    port: 5173,
    // Polling makes hot reload reliable on bind mounts (Docker Desktop on macOS/Windows)
    watch: { usePolling: true },
    proxy: { '/api': 'http://localhost:3000' },
  },
});
