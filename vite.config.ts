import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import path from 'node:path'

export default defineConfig(({ mode }) => {
  const isLibBuild = mode === 'mf'

  return {
    plugins: [
      react(),
      ...(isLibBuild
        ? [
            dts({
              entryRoot: 'src',
              include: ['src/mf-entry.tsx', 'src/UserManagementApp.tsx', 'src/**/*.ts', 'src/**/*.tsx'],
              exclude: [
                'src/**/*.test.ts',
                'src/**/*.test.tsx',
                'src/**/*.stories.tsx',
                'src/test/**',
                'src/modules/users/mocks/**',
                'src/main.tsx',
              ],
              rollupTypes: true,
              insertTypesEntry: true,
              tsconfigPath: './tsconfig.app.json',
            }),
          ]
        : []),
    ],
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
