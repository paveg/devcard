import { BarChart2, BarChart3, Code2, Github, Globe, Menu, Pin, X } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuItemRef = useRef<HTMLAnchorElement>(null);

  const navItems = [
    { to: '/stats', label: t('nav.stats'), icon: BarChart2 },
    { to: '/languages', label: t('nav.languages'), icon: Code2 },
    { to: '/pin', label: t('nav.pin'), icon: Pin },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ja' ? 'en' : 'ja';
    i18n.changeLanguage(newLang);
  };

  // Close menu on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    },
    [mobileMenuOpen]
  );

  // Focus first menu item when menu opens
  useEffect(() => {
    if (mobileMenuOpen) {
      firstMenuItemRef.current?.focus();
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, handleKeyDown]);

  // Close menu on route change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally close menu on path change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          <span className="hidden sm:inline">DevCard</span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label={t('nav.main', 'Main navigation')}
        >
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                location.pathname === to
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}

          <div className="ml-2 flex items-center gap-1 border-l border-border/50 pl-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs font-medium">{i18n.language === 'ja' ? 'EN' : 'JA'}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-muted-foreground hover:text-foreground"
            >
              <a href="https://github.com/paveg/devcard" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="text-muted-foreground"
          >
            <Globe className="h-4 w-4" />
          </Button>
          <Button
            ref={menuButtonRef}
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-muted-foreground"
            aria-expanded={mobileMenuOpen}
            aria-controls={mobileMenuId}
            aria-label={
              mobileMenuOpen ? t('nav.closeMenu', 'Close menu') : t('nav.openMenu', 'Open menu')
            }
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div
          id={mobileMenuId}
          className="border-t border-border/50 bg-background/95 backdrop-blur-md md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.mobileMenu', 'Mobile navigation menu')}
        >
          <nav
            className="container flex flex-col gap-1 py-3"
            aria-label={t('nav.main', 'Main navigation')}
          >
            {navItems.map(({ to, label, icon: Icon }, index) => (
              <Link
                key={to}
                ref={index === 0 ? firstMenuItemRef : undefined}
                to={to}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  location.pathname === to
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                )}
                aria-current={location.pathname === to ? 'page' : undefined}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </Link>
            ))}
            <a
              href="https://github.com/paveg/devcard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              GitHub
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
