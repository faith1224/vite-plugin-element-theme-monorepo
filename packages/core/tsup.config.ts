import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  dts: true,
  outDir: 'dist',
  format: ['cjs', 'esm'],
  external: [
    'esbuild',
    'vite/dist/client/client.mjs',
    'vite/dist/client/env.mjs',
    'rollup',
  ],
})
