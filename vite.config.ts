import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // Dev server (npm run dev)
  server: {
    host: true, // aceita conexões externas (0.0.0.0)
    allowedHosts: ['bio.mane.com.vc'], // libera esse host no modo dev, se você usar
  },

  // Vite preview (npm run preview) / ambiente tipo Railway, etc.
  preview: {
    host: true,
    allowedHosts: ['bio.mane.com.vc'], // <- o que o erro pediu
  },
});
