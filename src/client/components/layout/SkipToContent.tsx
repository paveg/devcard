import { useTranslation } from 'react-i18next';

/**
 * Accessibility: Skip to main content link
 * Allows keyboard users to bypass navigation and jump directly to main content
 */
export function SkipToContent() {
  const { t } = useTranslation();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      {t('accessibility.skipToContent', 'Skip to main content')}
    </a>
  );
}
