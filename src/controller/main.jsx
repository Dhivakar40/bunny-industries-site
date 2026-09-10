import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ContentProvider } from '../context/ContentContext';
import ControllerRoute from './ControllerRoute';

// ── Standalone controller entry ───────────────────────────────
// mode='controller': fetches content from API on mount, PATCHes on Save.
// Falls back to localStorage if VITE_API_BASE_URL is not set.

createRoot(document.getElementById('controller-root')).render(
  <StrictMode>
    <ContentProvider mode="controller">
      <ControllerRoute />
    </ContentProvider>
  </StrictMode>
);
