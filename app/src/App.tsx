import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import Home from './pages/Home';
import Studio from './pages/Studio';
import Library from './pages/Library';
import Templates from './pages/Templates';
import Models from './pages/Models';
import Project from './pages/Project';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import { T } from './tokens';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ height: '100vh', minHeight: 860, minWidth: 1280, display: 'flex', flexDirection: 'column', background: T.bg }}>
        <Header />
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/create"    element={<Studio />} />
          <Route path="/library"   element={<Library />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/models"    element={<Models />} />
          <Route path="/project"   element={<Project />} />
          <Route path="/billing"   element={<Billing />} />
          <Route path="/settings"  element={<Settings />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
