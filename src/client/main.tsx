import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { UsernameProvider } from './contexts/username';
import i18n from './i18n';
import { initWebVitals } from './lib/web-vitals';
import './index.css';

// Update HTML lang attribute when language changes
const updateHtmlLang = (lang: string) => {
  document.documentElement.lang = lang;
};

// Set initial lang and listen for changes
updateHtmlLang(i18n.language);
i18n.on('languageChanged', updateHtmlLang);

// Initialize Web Vitals monitoring
initWebVitals();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <UsernameProvider>
          <App />
        </UsernameProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
