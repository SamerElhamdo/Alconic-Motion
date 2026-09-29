import { NavLink } from 'react-router-dom';
import { T } from '../tokens';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/create', label: 'Create' },
  { to: '/library', label: 'Library' },
  { to: '/models', label: 'Models' },
  { to: '/templates', label: 'Templates' },
];

export function Header() {
  return (
    <header style={{
      height: 60, flex: 'none', display: 'flex', alignItems: 'center',
      gap: 28, padding: '0 20px', borderBottom: `1px solid ${T.borderFaint}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 9,
          background: 'linear-gradient(135deg,oklch(0.72 0.19 295),oklch(0.62 0.2 255))',
          display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 16,
          color: T.bg,
        }}>A</div>
        <span style={{ fontWeight: 600, fontSize: 18, letterSpacing: '-.01em' }}>Alconic Motion</span>
      </div>

      <nav style={{ display: 'flex', gap: 4 }}>
        {NAV.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} style={({ isActive }) => ({
            padding: '7px 14px', borderRadius: 8, fontSize: 14,
            color: isActive ? T.text : T.textMuted,
            background: isActive ? 'oklch(0.25 0.04 290)' : 'transparent',
            fontWeight: isActive ? 500 : 400,
            textDecoration: 'none',
          })}>{label}</NavLink>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      <div style={{
        width: 280, height: 36, display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 10px', borderRadius: 9,
        background: T.panelMid, border: `1px solid ${T.borderLight}`,
        color: T.textFaint, fontSize: 13,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
        </svg>
        <span style={{ flex: 1 }}>Search assets, projects...</span>
        <span style={{ fontFamily: T.mono, fontSize: 11, padding: '2px 6px', borderRadius: 5, background: 'oklch(0.25 0.03 285)' }}>⌘ K</span>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, height: 36, padding: '0 12px',
        borderRadius: 9, background: T.panelMid, border: `1px solid ${T.borderLight}`,
        fontSize: 14, fontWeight: 600,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: T.mint }} />
        1,240 cr
      </div>

      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'oklch(0.3 0.05 295)',
        display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 600,
      }}>SK</div>
    </header>
  );
}
