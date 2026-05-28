import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'image.png', '**/*.json'],
      manifest: {
        name: 'En Claro',
        short_name: 'En Claro',
        description: 'Twoja bezstresowa przestrzeń do ćwiczeń językowych.',
        theme_color: '#fdfaf6',
        background_color: '#fdfaf6',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff,woff2,otf,ttf,mp3,wav,ogg,m4a}']
      }
    })
  ]
});