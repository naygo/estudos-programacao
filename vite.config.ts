import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// eslint-disable-next-line import/no-default-export
export default defineConfig(({ mode }) => {
  const isLibBuild = mode === 'mf'

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: isLibBuild
      ? {
          lib: {
            entry: path.resolve(__dirname, 'src/mf-entry.tsx'),
            formats: ['es'],
            fileName: () => 'user-management-mf.js',
          },
          rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime', '@tanstack/react-query'],
          },
          sourcemap: true,
          emptyOutDir: true,
        }
      : {
          sourcemap: true,
        },
    server: {
      port: 5173,
    },
  }
})
