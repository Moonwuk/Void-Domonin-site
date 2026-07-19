import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base` is overridable for GitHub Pages project sites (served under /<repo>/).
// Set VITE_BASE=/void-dominion-site/ in the Pages build; defaults to root elsewhere.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
})
