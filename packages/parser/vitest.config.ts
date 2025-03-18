import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    globals: true
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    conditions: ['import', 'node']
  },
  optimizeDeps: {
    include: ['unified', 'remark-parse', 'remark-gfm']
  }
}) 