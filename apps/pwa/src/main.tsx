import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App.jsx';
import { ErrorBoundary } from './ErrorBoundary.jsx';
import { UpdatePrompt } from './UpdatePrompt.jsx';
import './styles.css';

const container = document.getElementById('root');
if (container === null) throw new Error('no #root element to mount into');

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
      <UpdatePrompt />
    </ErrorBoundary>
  </StrictMode>,
);
