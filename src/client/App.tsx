import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { StatsGenerator } from './pages/StatsGenerator';
import { LanguagesGenerator } from './pages/LanguagesGenerator';
import { PinGenerator } from './pages/PinGenerator';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<StatsGenerator />} />
        <Route path="/languages" element={<LanguagesGenerator />} />
        <Route path="/pin" element={<PinGenerator />} />
      </Route>
    </Routes>
  );
}

export default App;
