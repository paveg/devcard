import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { UsernameProvider } from './contexts/username';
import i18n from './i18n';
import './index.css';

// Update HTML lang attribute when language changes
const updateHtmlLang = (lang: string) => {
  document.documentElement.lang = lang;
};

// Set initial lang and listen for changes
updateHtmlLang(i18n.language);
i18n.on('languageChanged', updateHtmlLang);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UsernameProvider>
        <App />
      </UsernameProvider>
    </BrowserRouter>
  </StrictMode>
);
