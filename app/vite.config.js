import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// قاعدة المسار: '/narges/' عند بناء GitHub Pages، و'/' لغير ذلك (Vercel/محلي).
const base = process.env.GITHUB_PAGES === 'true' ? '/narges/' : '/'

export default defineConfig({
  plugins: [react()],
  base,
})
