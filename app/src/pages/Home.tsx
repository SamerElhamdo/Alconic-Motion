import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import { AgentRobot } from '../components/AgentRobot';

const AGENTS = [
  { name: 'Story',  desc: 'Breaks your idea into a scene-by-scene story arc' },
  { name: 'Motion', desc: 'Plans camera moves, transitions and pacing' },
  { name: 'Assets', desc: 'Generates and curates every visual element' },
  { name: 'Audio',  desc: 'Designs soundscape, SFX and background music' },
  { name: 'Vision', desc: 'Composites, lights and applies your style' },
  { name: 'QC',     desc: 'Checks quality, consistency and brand fit' },
  { name: 'Render', desc: 'Encodes and delivers the final export' },
];

const TEMPLATES = [
  { label: 'Product launch',  dur: '15s', ratio: '9:16' },
  { label: 'Brand intro',     dur: '10s', ratio: '16:9' },
  { label: 'Social reel',     dur: '30s', ratio: '9:16' },
  { label: 'Music visual',    dur: '60s', ratio: '1:1'  },
  { label: 'Event highlight', dur: '45s', ratio: '16:9' },
  { label: 'Explainer',       dur: '90s', ratio: '16:9' },
];

const RECENT = [
  { title: 'Cinematic whale rising...', state: 'Rendered', updated: '2h ago',   ratio: '16:9' },
  { title: 'Product launch spring',     state: 'Draft',    updated: '1d ago',   ratio: '9:16' },
  { title: 'Brand ident v3',            state: 'Rendered', updated: '3d ago',   ratio: '1:1'  },
  { title: 'Music video concept',       state: 'Draft',    updated: '5d ago',   ratio: '16:9' },
];

export default function Home() {
  const [idea, setIdea] = useState('');
  const navigate = useNavigate();

  function submit() {
    if (idea.trim()) navigate('/create', { state: { idea } });
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

      {/* Hero */}
      <section style={{
        position: 'relative', minHeight: 400, display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexDirection: 'column', gap: 28, padding: '60px 20px 40px',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.22 0.06 295 / .4), transparent)',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 680 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20,
            padding: '5px 14px', borderRadius: 20,
            background: T.violetBg, border: `1px solid oklch(0.45 0.12 295 / .5)`,
            fontSize: 13, color: T.violet,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.violet }} />
            Seven AI agents, one final cut
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
            Turn any idea into<br />
            <span style={{ background: `linear-gradient(90deg,${T.violet},oklch(0.7 0.2 255))`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              a cinematic video
            </span>
          </h1>
          <p style={{ fontSize: 17, color: T.textMuted, lineHeight: 1.6, marginBottom: 28 }}>
            Describe your vision. Seven specialized AI agents handle everything from story to final render — in minutes.
          </p>
        </div>

        <div style={{
          width: '100%', maxWidth: 680, padding: '16px 16px 14px',
          borderRadius: 16, background: T.panel, border: `1px solid oklch(0.55 0.15 295 / .5)`,
          boxShadow: `0 0 40px oklch(0.7 0.19 295 / .07)`,
        }}>
          <textarea
            value={idea}
            onChange={e => setIdea(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
            placeholder="Describe your video idea..."
            rows={2}
            style={{
              width: '100%', resize: 'none', border: 0, outline: 0,
              background: 'transparent', color: T.text, fontSize: 15, lineHeight: 1.5,
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
            <span style={{ flex: 1, fontSize: 12, color: T.textFaint }}>
              Try: "A cinematic whale rising from the ocean, neon glow, 10 seconds"
            </span>
            <button onClick={submit} style={{
              height: 38, padding: '0 18px', borderRadius: 10, border: 0,
              background: idea.trim() ? T.violet : 'oklch(0.35 0.05 290)',
              color: T.bg, fontWeight: 600, fontSize: 14,
              cursor: idea.trim() ? 'pointer' : 'default',
              transition: 'background .15s',
            }}>Create video →</button>
          </div>
        </div>
      </section>

      {/* Recent projects */}
      <section style={{ padding: '0 40px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600 }}>Continue editing</h2>
          <a href="/library" style={{ fontSize: 13, color: T.textMuted }}>View all →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {RECENT.map(p => (
            <div key={p.title} onClick={() => navigate('/project')} style={{
              borderRadius: 12, background: T.panel, border: `1px solid ${T.border}`,
              overflow: 'hidden', cursor: 'pointer',
              transition: 'border-color .15s',
            }}>
              <div style={{
                height: p.ratio === '9:16' ? 180 : 120,
                background: 'repeating-linear-gradient(135deg,oklch(0.22 0.03 285) 0 12px,oklch(0.24 0.035 285) 12px 24px)',
                display: 'grid', placeItems: 'center',
                fontFamily: T.mono, fontSize: 11, color: T.textFaint,
              }}>{p.ratio}</div>
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 6, fontSize: 12, color: T.textMuted }}>
                  <span style={{
                    padding: '2px 7px', borderRadius: 5, fontSize: 11,
                    background: p.state === 'Rendered' ? T.mintBg : 'oklch(0.25 0.03 285)',
                    color: p.state === 'Rendered' ? T.mint : T.textMuted,
                  }}>{p.state}</span>
                  <span>{p.updated}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Templates */}
      <section style={{ padding: '0 40px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600 }}>Start from a template</h2>
          <a href="/templates" style={{ fontSize: 13, color: T.textMuted }}>Browse all →</a>
        </div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
          {TEMPLATES.map(t => (
            <div key={t.label} onClick={() => navigate('/create')} style={{
              flex: 'none', width: 180, borderRadius: 12, background: T.panel,
              border: `1px solid ${T.border}`, overflow: 'hidden', cursor: 'pointer',
            }}>
              <div style={{
                height: 100,
                background: 'repeating-linear-gradient(135deg,oklch(0.22 0.03 285) 0 10px,oklch(0.24 0.035 285) 10px 20px)',
                display: 'grid', placeItems: 'center',
                fontFamily: T.mono, fontSize: 11, color: T.textFaint,
              }}>PREVIEW</div>
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{t.label}</div>
                <div style={{ fontSize: 12, color: T.textMuted, marginTop: 4 }}>{t.dur} · {t.ratio}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Agents */}
      <section style={{ padding: '0 40px 60px' }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 18 }}>Meet your agents</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12 }}>
          {AGENTS.map(a => (
            <div key={a.name} style={{
              padding: '20px 14px', borderRadius: 14, background: T.panel,
              border: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
            }}>
              <AgentRobot name={a.name} status="done" />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{a.name}</div>
                <div style={{ fontSize: 11, color: T.textMuted, lineHeight: 1.5 }}>{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
