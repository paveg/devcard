import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      <div className="container">
        <p>
          {t('footer.madeBy')}{' '}
          <a
            href="https://github.com/paveg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline"
          >
            paveg
          </a>
          {' · '}
          <a
            href="https://github.com/paveg/devcard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline"
          >
            {t('footer.viewOnGitHub')}
          </a>
        </p>
      </div>
    </footer>
  );
}
