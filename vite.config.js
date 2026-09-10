import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ── Dev config ────────────────────────────────────────────────
// Used by `npm run dev`. Both the public site (/) and the
// controller (/controller) are accessible in this mode.
// __INCLUDE_CONTROLLER__ is set to true so App.jsx's lazy import fires.

export default defineConfig({
  plugins: [react()],

  define: {
    __INCLUDE_CONTROLLER__: 'true',
    __CONTENT_PROVIDER_MODE__: JSON.stringify('dev'),
  },
});
