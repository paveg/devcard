import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BarChart3, BarChart2, Code2, Pin, Github, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Header() {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const navItems = [
    { to: '/stats', label: t('nav.stats'), icon: BarChart2 },
    { to: '/languages', label: t('nav.languages'), icon: Code2 },
    { to: '/pin', label: t('nav.pin'), icon: Pin },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ja' ? 'en' : 'ja';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <BarChart3 className="h-5 w-5" />
          <span>DevCard</span>
        </Link>

        <nav className="flex items-center gap-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-1.5 text-sm transition-colors hover:text-foreground',
                location.pathname === to
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Globe className="h-4 w-4" />
            <span className="text-xs">{i18n.language === 'ja' ? 'EN' : 'JA'}</span>
          </Button>
          <a
            href="https://github.com/paveg/devcard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-5 w-5" />
          </a>
        </nav>
      </div>
    </header>
  );
}
