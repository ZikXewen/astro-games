import { defineConfig } from 'astro/config'
import preact from '@astrojs/preact'
import tailwind from '@astrojs/tailwind'
import wasm from 'vite-plugin-wasm'

import svelte from '@astrojs/svelte'

// https://astro.build/config
export default defineConfig({
  integrations: [preact(), tailwind(), svelte()],
  vite: {
    plugins: [wasm()],
    optimizeDeps: {
      exclude: ['mswp'],
    },
  },
})
