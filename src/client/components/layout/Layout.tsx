import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';
import { SkipToContent } from './SkipToContent';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipToContent />
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
