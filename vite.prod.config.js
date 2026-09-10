import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ── Site-only production build ────────────────────────────────
// This config is used by `npm run build`. It:
//   - Sets __INCLUDE_CONTROLLER__ = false so Rollup statically eliminates
//     the entire src/controller/ subtree via dead-code removal.
//   - Outputs to dist/site/
//   - Enables all production optimisations (minification, tree-shaking, chunk splitting).
//
// The controller code never appears in this bundle — not even as a comment.
// Verify with: `npm run build` → inspect dist/site/assets/ — no "ControllerApp"
// or "SectionEditors" strings will be present.

export default defineConfig({
  plugins: [react()],

  define: {
    __INCLUDE_CONTROLLER__: 'false',
    __CONTENT_PROVIDER_MODE__: JSON.stringify('site'),
  },

  build: {
    outDir: 'dist/site',
    emptyOutDir: true,
    sourcemap: false,

    rollupOptions: {
      input: {
        site: 'index.html',
      },

      output: {
        // Sensible chunk splitting for the public site
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion';
          }
          if (id.includes('node_modules/lenis')) {
            return 'lenis';
          }
          if (id.includes('node_modules/react-router-dom')) {
            return 'router';
          }
        },
      },
    },
  },
});
