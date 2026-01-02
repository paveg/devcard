import { Link, useLocation } from 'react-router-dom';
import { BarChart3, BarChart2, Code2, Pin, Github } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/stats', label: 'Stats', icon: BarChart2 },
  { to: '/languages', label: 'Languages', icon: Code2 },
  { to: '/pin', label: 'Pin', icon: Pin },
];

export function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <BarChart3 className="h-5 w-5" />
          <span>DevCard</span>
        </Link>

        <nav className="flex items-center gap-6">
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
