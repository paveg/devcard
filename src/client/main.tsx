import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { UsernameProvider } from './contexts/username';
import './i18n';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UsernameProvider>
        <App />
      </UsernameProvider>
    </BrowserRouter>
  </StrictMode>
);
