import { useState } from 'react';
import { T } from '../tokens';

type Phase = 'rendering'|'ready'|'failed';

const VERSIONS = [
  { v:'v3', label:'Current · Approved & render', dur:'10s', date:'Just now', state:'done' },
  { v:'v2', label:'Storyboard approved',         dur:'10s', date:'2h ago',   state:'done' },
  { v:'v1', label:'Initial draft',               dur:'8s',  date:'5h ago',   state:'done' },
];

const AGENT_LOG = [
  { name:'Story',  dur:'12s', out:'6-scene story arc with whale motif' },
  { name:'Motion', dur:'18s', out:'Slow pan + upward tracking shot plan' },
  { name:'Assets', dur:'45s', out:'Generated 14 assets: particles, lighting, whale texture' },
  { name:'Audio',  dur:'22s', out:'Cinematic orchestral SFX, 10s mix' },
  { name:'Vision', dur:'38s', out:'Composited 6 scenes with neon grade' },
  { name:'QC',     dur:'8s',  out:'Passed all checks — 98/100 quality score' },
  { name:'Render', dur:'62s', out:'Encoded 1080p MP4, 12.4 MB' },
];

export default function Project() {
  const [phase, setPhase] = useState<Phase>('ready');
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(4.2);
  const [version, setVersion] = useState('v3');
  const [shareOpen, setShareOpen] = useState(false);

  const pp = t / 10 * 100;

  return (
    <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column' }}>
      {/* Phase bar */}
      <div style={{ height:38, flex:'none', display:'flex', alignItems:'center', gap:12, padding:'0 20px', background:T.bgDeep, borderBottom:`1px solid ${T.borderFaint}` }}>
        <span style={{ fontFamily:T.mono, fontSize:11, letterSpacing:'.08em', textTransform:'uppercase', color:T.textFaint }}>Project states</span>
        <div style={{ display:'flex', gap:4 }}>
          {(['rendering','ready','failed'] as Phase[]).map((p,i) => (
            <button key={p} onClick={()=>setPhase(p)} style={{ height:26, padding:'0 12px', borderRadius:7, border:`1px solid ${p===phase?T.violetDim:T.border}`, background:p===phase?T.violetBg:'transparent', color:p===phase?T.violet:T.textMuted, font:`500 12px ${T.sans}`, cursor:'pointer' }}>
              <span style={{ fontFamily:T.mono, fontSize:11, opacity:.7 }}>{i+1} </span>
              {p.charAt(0).toUpperCase()+p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateColumns:'minmax(0,1fr) 320px', gap:12, padding:12 }}>
        {/* Center: Player */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ borderRadius:16, background:T.panel, border:`1px solid ${T.border}`, overflow:'hidden', flex:1, display:'flex', flexDirection:'column' }}>
            <div style={{ height:52, flex:'none', display:'flex', alignItems:'center', gap:10, padding:'0 16px' }}>
              <span style={{ fontSize:15, fontWeight:600 }}>A cinematic whale rising from the ocean</span>
              <span style={{ fontFamily:T.mono, fontSize:11, padding:'3px 8px', borderRadius:6,
                background: phase==='ready'?T.mintBg:phase==='failed'?T.coralBg:'oklch(0.3 0.08 295)',
                color: phase==='ready'?T.mint:phase==='failed'?T.coral:'oklch(0.88 0.08 295)',
              }}>
                {phase==='ready'?'Rendered · 1080p':phase==='failed'?'Render failed':'In queue'}
              </span>
              <div style={{ flex:1 }} />
              <button onClick={()=>setShareOpen(true)} style={{ height:32, padding:'0 14px', borderRadius:8, border:`1px solid ${T.border}`, background:'transparent', color:T.textMid, font:`500 13px ${T.sans}`, cursor:'pointer' }}>Share</button>
              <button style={{ height:32, padding:'0 14px', borderRadius:8, border:0, background:phase==='ready'?T.mint:T.panel, color:phase==='ready'?T.bg:T.textMuted, font:`600 13px ${T.sans}`, cursor:'pointer' }}>
                {phase==='ready'?'↓ Download':'—'}
              </button>
            </div>

            <div style={{ flex:1, position:'relative', background:'repeating-linear-gradient(135deg,oklch(0.2 0.03 285) 0 12px,oklch(0.22 0.035 285) 12px 24px)', display:'grid', placeItems:'center', minHeight:300 }}>
              {phase==='rendering' && (
                <div style={{ textAlign:'center' }}>
                  <span className="spinner-lg" style={{ display:'block', margin:'0 auto' }} />
                  <div style={{ fontSize:18, fontWeight:600, marginTop:16 }}>Rendering your video</div>
                  <div style={{ fontSize:13, color:T.textMuted, marginTop:6 }}>Position 2 in queue · ~3 min remaining</div>
                  <div style={{ width:240, height:4, borderRadius:2, background:T.border, margin:'16px auto 0', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:'35%', background:T.violet }} />
                  </div>
                </div>
              )}
              {phase==='ready' && (
                <>
                  <span style={{ position:'absolute', top:14, left:14, fontFamily:T.mono, fontSize:11, padding:'4px 8px', borderRadius:6, background:'oklch(0.14 0.02 285 / .8)', color:T.textMuted }}>VIDEO PLACEHOLDER · 16:9 · 1080p</span>
                  <button onClick={()=>setPlaying(p=>!p)} style={{ width:72, height:72, borderRadius:'50%', border:`1px solid oklch(1 0 0 / .25)`, background:'oklch(0.14 0.02 285 / .7)', color:T.text, display:'grid', placeItems:'center', cursor:'pointer', fontSize:24 }}>{playing?'❚❚':'▶'}</button>
                </>
              )}
              {phase==='failed' && (
                <div style={{ width:380, padding:24, borderRadius:14, background:'oklch(0.2 0.03 285)', border:`1px solid oklch(0.72 0.17 25 / .5)`, textAlign:'center' }}>
                  <div style={{ fontSize:32, marginBottom:12 }}>⚠</div>
                  <div style={{ fontSize:18, fontWeight:600 }}>Render failed</div>
                  <div style={{ fontSize:13, color:T.textMuted, marginTop:8, lineHeight:1.5 }}>The Render agent encountered an error on scene 4. Credits were not charged.</div>
                  <button style={{ marginTop:16, height:38, padding:'0 20px', borderRadius:9, border:0, background:T.coral, color:T.bg, font:`600 13px ${T.sans}`, cursor:'pointer' }}>Retry render</button>
                </div>
              )}
            </div>

            {phase==='ready' && (
              <div style={{ height:52, flex:'none', display:'flex', alignItems:'center', gap:14, padding:'0 16px', borderTop:`1px solid ${T.borderFaint}` }}>
                <button onClick={()=>setPlaying(p=>!p)} style={{ width:32, height:32, borderRadius:'50%', border:`1px solid ${T.borderLight}`, background:'oklch(0.22 0.02 285)', color:T.text, cursor:'pointer', fontSize:12 }}>{playing?'❚❚':'▶'}</button>
                <span style={{ fontFamily:T.mono, fontSize:13 }}>00:{String(Math.floor(t)).padStart(2,'0')}.{String(Math.round((t%1)*100)).padStart(2,'0')} <span style={{ color:T.textFaint }}>/ 00:10.00</span></span>
                <div onClick={e=>{ const r=e.currentTarget.getBoundingClientRect(); setT(Math.max(0,Math.min(10,(e.clientX-r.left)/r.width*10))); }} style={{ position:'relative', flex:1, height:18, display:'flex', alignItems:'center', cursor:'pointer' }}>
                  <div style={{ width:'100%', height:4, borderRadius:2, background:T.border }} />
                  <div style={{ position:'absolute', left:0, height:4, borderRadius:2, width:`${pp}%`, background:T.violet }} />
                  <div style={{ position:'absolute', left:`${pp}%`, width:14, height:14, marginLeft:-7, borderRadius:'50%', background:T.text }} />
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  {['MP4','MOV','GIF'].map(f => (
                    <button key={f} style={{ height:28, padding:'0 10px', borderRadius:7, border:`1px solid ${T.border}`, background:'transparent', color:T.textMid, font:`500 11px ${T.sans}`, cursor:'pointer', fontFamily:T.mono }}>{f}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Agent log */}
          <div style={{ borderRadius:16, background:T.panel, border:`1px solid ${T.border}`, padding:16 }}>
            <div style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>Agent log</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {AGENT_LOG.map(a => (
                <div key={a.name} style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ width:56, fontFamily:T.mono, fontSize:12, color:T.textMuted }}>{a.name}</span>
                  <span style={{ width:36, fontFamily:T.mono, fontSize:11, color:T.textFaint }}>{a.dur}</span>
                  <span style={{ flex:1, fontSize:12, color:T.textMid }}>{a.out}</span>
                  <span style={{ width:16, height:16, borderRadius:'50%', background:T.mint, color:T.bg, display:'grid', placeItems:'center', fontSize:10, fontWeight:700, flex:'none' }}>✓</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {/* Versions */}
          <div style={{ borderRadius:16, background:T.panel, border:`1px solid ${T.border}`, padding:16 }}>
            <div style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>Versions</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {VERSIONS.map(v => (
                <div key={v.v} onClick={()=>setVersion(v.v)} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, background:version===v.v?T.violetBg:T.panelDark, border:`1px solid ${version===v.v?T.violetDim:T.border}`, cursor:'pointer' }}>
                  <span style={{ fontFamily:T.mono, fontSize:13, fontWeight:600, color:version===v.v?T.violet:T.textMuted, width:24 }}>{v.v}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:500 }}>{v.label}</div>
                    <div style={{ fontSize:11, color:T.textFaint, marginTop:2 }}>{v.date}</div>
                  </div>
                  <span style={{ width:16, height:16, borderRadius:'50%', background:T.mint, color:T.bg, display:'grid', placeItems:'center', fontSize:10, fontWeight:700 }}>✓</span>
                </div>
              ))}
            </div>
          </div>

          {/* Render info */}
          <div style={{ borderRadius:16, background:T.panel, border:`1px solid ${T.border}`, padding:16 }}>
            <div style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>Render info</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[['Model','Seedance 2.5'],['Duration','10s'],['Resolution','1080p'],['Aspect ratio','16:9'],['Style','Cinematic'],['Credits used','98 cr'],['Render time','62s']].map(([k,v])=>(
                <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                  <span style={{ color:T.textMuted }}>{k}</span>
                  <span style={{ fontFamily:T.mono, fontSize:12 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Share modal */}
      {shareOpen && (
        <div onClick={()=>setShareOpen(false)} style={{ position:'fixed', inset:0, background:'oklch(0 0 0 / .6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }}>
          <div onClick={e=>e.stopPropagation()} style={{ width:460, borderRadius:18, background:T.panel, border:`1px solid ${T.border}`, padding:24, display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:17, fontWeight:600 }}>Share project</span>
              <button onClick={()=>setShareOpen(false)} style={{ background:'transparent', border:0, color:T.textMuted, cursor:'pointer', fontSize:20 }}>×</button>
            </div>
            <div style={{ padding:'10px 14px', borderRadius:10, background:T.panelDark, border:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:10, fontSize:13 }}>
              <span style={{ flex:1, fontFamily:T.mono, fontSize:12, color:T.textMuted }}>https://alconic.motion/p/whale-rise-v3</span>
              <button style={{ height:28, padding:'0 12px', borderRadius:7, border:0, background:T.violet, color:T.bg, font:`600 12px ${T.sans}`, cursor:'pointer' }}>Copy</button>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              {['Public','Private','Embed'].map((opt,i) => (
                <button key={opt} style={{ flex:1, height:34, borderRadius:8, border:`1px solid ${i===1?T.violetDim:T.border}`, background:i===1?T.violetBg:'transparent', color:i===1?T.violet:T.textMuted, font:`500 13px ${T.sans}`, cursor:'pointer' }}>{opt}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
