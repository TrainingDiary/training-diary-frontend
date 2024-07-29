import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'Training Diary',
        short_name: '트다',
        description:
          '트레이너의 효율적인 트레이니 관리 플랫폼🏋️‍♀️ - PT 예약, 트레이닝 세션 관리, 식단 피드백을 한 곳에서 해결하세요!',
        icons: [
          {
            src: '/favicon/android-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/public/favicon/maskable_icon_x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/favicon/android-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/public/favicon/maskable_icon_x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/favicon/apple-icon-180x180.png',
            sizes: '180x180',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@icons': '/src/assets/icons',
      '@components': '/src/components',
      '@pages': '/src/pages',
    },
  },
});
