import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  // Base path for GitHub Pages (served under /Bedrock-Mantle-UI/).
  // Vercel serves from root, so this only affects the Pages build.
  base: process.env.GITHUB_PAGES === 'true' ? '/Bedrock-Mantle-UI/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
