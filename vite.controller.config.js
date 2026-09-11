import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ── Controller-only production build ─────────────────────────
// Used by `npm run build:controller`. Outputs to dist/controller/.
// This build:
//   - Sets __INCLUDE_CONTROLLER__ = true (no-op in this context since
//     the entry is main.jsx which imports the controller directly)
//   - Does NOT include any public site components
//   - Sets the preview URL in ControllerApp to point at the deployed site
//     (override with VITE_SITE_PREVIEW_URL env var if needed)
//
// Deployment model:
//   dist/site/       → deploy to production CDN / hosting (Netlify, Vercel, etc.)
//   dist/controller/ → deploy to a separate URL (e.g. admin.yourdomain.com)
//                      or serve locally only. Password-gated via ControllerRoute.

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
    // Allows overriding the preview iframe URL in the built controller
    __SITE_PREVIEW_URL__: JSON.stringify(
      process.env.VITE_SITE_PREVIEW_URL ?? 'http://localhost:5173'
    ),
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
