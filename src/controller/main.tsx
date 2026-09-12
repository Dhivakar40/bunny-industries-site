import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import { ContentProvider } from '../context/ContentContext';
import ControllerRoute from './ControllerRoute';

createRoot(document.getElementById('controller-root')!).render(
  <StrictMode>
    <ContentProvider mode="controller">
      <ControllerRoute />
    </ContentProvider>
  </StrictMode>,
);