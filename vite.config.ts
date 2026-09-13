import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      // Заявка на демо, проверка ИНН и материалы старого сайта живут на billing.smit34.ru
      // (nginx прячет токены Telegram и DaData). В разработке ходим туда же.
      proxy: Object.fromEntries(
        [
          '/api',
          '/SMIT_Billing_KP.pdf',
          '/SMIT_Billing_Unified_ISP_Platform.pdf',
          '/podcast_smit_billing.m4a',
          '/blog',
          '/compare',
          '/license',
          '/privacy.html',
          '/support.html',
          '/copyright.html',
        ].map((path) => [path, { target: 'https://billing.smit34.ru', changeOrigin: true, secure: true }]),
      ),
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
