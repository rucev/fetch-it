import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    setupFiles: ['./vitestSetup.ts'],
    environment: 'jsdom',
  },
})
