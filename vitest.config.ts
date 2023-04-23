import * as path from "path";
import {defineConfig} from "vitest/config";

const resolve = (p: string) => path.resolve(__dirname, p)

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    // false to fix canvas node error
    threads: false,
    alias: [
      { find: 'vs', replacement: resolve('src/vs') },
    ],
    setupFiles: ['test/unit/setup.ts'],
  }
})
