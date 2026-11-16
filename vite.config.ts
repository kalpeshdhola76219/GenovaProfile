import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rolldownOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('jspdf')) return 'vendor-jspdf';
              if (id.includes('html2canvas-pro')) return 'vendor-html2canvas';
              if (id.includes('@supabase')) return 'vendor-supabase';
              if (id.includes('lucide-react')) return 'vendor-icons';
              if (id.includes('motion') || id.includes('framer-motion')) return 'vendor-motion';
              if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) return 'vendor-react';
              return 'vendor-misc';
            }
            if (id.includes('/src/templates/resume/')) return 'templates-resume';
            if (id.includes('/src/templates/biodata/')) return 'templates-biodata';
            if (id.includes('/src/templates/coverletter/')) return 'templates-coverletter';
            if (id.includes('/src/data/')) return 'app-data';
            if (id.includes('/src/pages/')) return 'app-pages';
            if (id.includes('/src/components/modals/')) return 'app-modals';
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
