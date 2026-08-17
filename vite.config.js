import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

function socialProxy(base, target) {
  return {
    target,
    changeOrigin: true,
    rewrite: path => path.replace(new RegExp(`^${base}`), ''),
    headers: {
      'User-Agent': UA,
      'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
    },
    configure: proxy => {
      proxy.on('error', err => console.error(`[proxy${base}]`, err.message))
    },
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // GoDaddy API — forwards Authorization header from client
      '/api/godaddy': {
        target: 'https://api.godaddy.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/godaddy/, ''),
        configure: proxy => {
          proxy.on('error', err => console.error('[proxy:godaddy]', err.message))
        },
      },
      // Social platform proxies
      '/api/instagram': socialProxy('/api/instagram', 'https://www.instagram.com'),
      '/api/youtube':   socialProxy('/api/youtube',   'https://www.youtube.com'),
      '/api/twitter':   socialProxy('/api/twitter',   'https://x.com'),
      '/api/facebook':  socialProxy('/api/facebook',  'https://www.facebook.com'),
    },
  },
})
