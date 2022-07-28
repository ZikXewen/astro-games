import { defineConfig } from 'astro/config'
import preact from '@astrojs/preact'
import tailwind from '@astrojs/tailwind'
import wasm from 'vite-plugin-wasm'

// https://astro.build/config
export default defineConfig({
  integrations: [preact(), tailwind()],
  vite: { plugins: [wasm()] },
})
