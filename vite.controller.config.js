import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ── Controller-only production build ─────────────────────────
// Used by `npm run build:controller`. Outputs to dist/controller/.
// This build:
//   - Uses controller.html as the entry (renamed to index.html in output)
//   - Sets __INCLUDE_CONTROLLER__ = true
//   - Does NOT include public site routing — ControllerRoute is the only root
//   - The right-panel preview renders actual site components directly in-tree
//     (no iframe, no localhost dependency, works on any device/network)
//
// Deployment model:
//   dist/site/       → bunnyweb.vercel.app  (public site + /api/* serverless)
//   dist/controller/ → bunnycontroller.vercel.app (CMS admin UI, standalone)

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'rename-html',
      enforce: 'post',
      generateBundle(options, bundle) {
        if (bundle['controller.html']) {
          bundle['controller.html'].fileName = 'index.html';
        }
      }
    }
  ],

  define: {
  __INCLUDE_CONTROLLER__: 'true',
  },

  build: {
    outDir: 'dist/controller',
    emptyOutDir: true,
    sourcemap: false,

    rollupOptions: {
      input: {
        index: 'controller.html',
      },

      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion';
          }
        },
      },
    },
  },
});
