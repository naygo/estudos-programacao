import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

/**
 * Layer boundary rules:
 *   components/  → may import controllers, domain, shared, components/ui
 *                  MUST NOT import services, datasource
 *   controllers/ → may import services, domain, shared
 *                  MUST NOT import datasource
 *   services/    → may import datasource, domain, shared
 *   datasource/  → may import domain, shared only
 */
const layerBoundaries = {
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          group: ['**/services/**', '**/datasource/**'],
          message:
            'Component layers cannot import services/data sources. Use a controller (hook)..',
        },
      ],
    },
  ],
}

const controllerBoundaries = {
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          group: ['**/datasource/**'],
          message: 'Controller layers cannot import datasource. Go through the service layer.',
        },
      ],
    },
  ],
}

const serviceBoundaries = {
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          group: ['**/controllers/**', '**/components/**'],
          message: 'Service layers cannot import controllers/components. Use the domain layer.',
        },
      ],
    },
  ],
}

const datasourceBoundaries = {
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          group: ['**/services/**', '**/controllers/**', '**/components/**'],
          message: 'Datasource layers can only import domain/shared. Nothing above.',
        },
      ],
    },
  ],
}

export default defineConfig([
  globalIgnores([
    'dist',
    'coverage',
    'storybook-static',
    'playwright-report',
    'test-results',
    'public/mockServiceWorker.js',
  ]),

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2022 },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // Layer boundaries
  {
    files: ['src/modules/**/components/**/*.{ts,tsx}'],
    rules: layerBoundaries,
  },
  {
    files: ['src/modules/**/controllers/**/*.{ts,tsx}'],
    rules: controllerBoundaries,
  },
  {
    files: ['src/modules/**/services/**/*.{ts,tsx}'],
    rules: serviceBoundaries,
  },
  {
    files: ['src/modules/**/datasource/**/*.{ts,tsx}'],
    rules: datasourceBoundaries,
  },

  // shadcn UI primitives
  {
    files: ['src/components/ui/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },

  // Test files — relaxed
  {
    files: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}', 'src/test/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-restricted-imports': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },

  // Context files — relaxed
  {
    files: ['**/servicesContext.tsx', '**/*Context.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },

  // Config files
  {
    files: ['*.config.{ts,js}', '.storybook/**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.node } },
  },

  prettier,
])
