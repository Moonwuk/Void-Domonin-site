import { defineConfig } from 'vite'

// `base` is overridable for GitHub Pages project sites (served under /<repo>/).
// Set VITE_BASE=/Void-Domonin-site/ in the Pages build; defaults to root elsewhere.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
})
