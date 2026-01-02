import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { PageLoader } from './components/layout/PageLoader';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const StatsGenerator = lazy(() =>
  import('./pages/StatsGenerator').then((m) => ({ default: m.StatsGenerator }))
);
const LanguagesGenerator = lazy(() =>
  import('./pages/LanguagesGenerator').then((m) => ({ default: m.LanguagesGenerator }))
);
const PinGenerator = lazy(() =>
  import('./pages/PinGenerator').then((m) => ({ default: m.PinGenerator }))
);

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<PageLoader />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/stats"
          element={
            <Suspense fallback={<PageLoader />}>
              <StatsGenerator />
            </Suspense>
          }
        />
        <Route
          path="/languages"
          element={
            <Suspense fallback={<PageLoader />}>
              <LanguagesGenerator />
            </Suspense>
          }
        />
        <Route
          path="/pin"
          element={
            <Suspense fallback={<PageLoader />}>
              <PinGenerator />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
