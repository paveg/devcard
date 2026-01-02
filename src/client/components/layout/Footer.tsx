import { Github, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border/50 py-8">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            {t('footer.madeBy')}
            <Heart className="h-3.5 w-3.5 text-red-500" />
            <a
              href="https://github.com/paveg"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground transition-colors hover:text-primary"
            >
              paveg
            </a>
          </p>
          <a
            href="https://github.com/paveg/devcard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            {t('footer.viewOnGitHub')}
          </a>
        </div>
      </div>
    </footer>
  );
}
