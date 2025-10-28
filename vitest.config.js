import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.js',
    include: ['tests/**/*.spec.{js,jsx,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: 'coverage',
      all: true,
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/vite-env.d.ts', 'src/setupTests.js']
    }
  }
})