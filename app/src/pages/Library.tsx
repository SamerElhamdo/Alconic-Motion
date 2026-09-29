import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';

type Filter = 'All'|'Videos'|'Images'|'Audio'|'Drafts';
type View = 'grid'|'list';

const ASSETS = [
  { id:1, title:'Cinematic whale rising',    type:'video', dur:'10s', res:'1080p', date:'Sep 29',  ratio:'16:9' },
  { id:2, title:'Product launch spring',     type:'video', dur:'30s', res:'720p',  date:'Sep 28',  ratio:'9:16' },
  { id:3, title:'Brand ident v3',            type:'video', dur:'8s',  res:'1080p', date:'Sep 26',  ratio:'1:1'  },
  { id:4, title:'Nature ambience',           type:'audio', dur:'2m',  res:'—',     date:'Sep 25',  ratio:'1:1'  },
  { id:5, title:'Office hero shot',          type:'image', dur:'—',   res:'4K',    date:'Sep 24',  ratio:'16:9' },
  { id:6, title:'Music video concept',       type:'video', dur:'45s', res:'720p',  date:'Sep 22',  ratio:'9:16' },
  { id:7, title:'Explainer draft',           type:'video', dur:'90s', res:'720p',  date:'Sep 20',  ratio:'16:9' },
  { id:8, title:'Event highlight reel',      type:'video', dur:'60s', res:'1080p', date:'Sep 18',  ratio:'16:9' },
];

const BADGE: Record<string,{bg:string,c:string}> = {
  video: { bg:'oklch(0.3 0.08 295)',   c:'oklch(0.88 0.08 295)' },
  image: { bg:'oklch(0.3 0.07 235)',   c:'oklch(0.88 0.08 235)' },
  audio: { bg:'oklch(0.3 0.07 170)',   c:T.mint },
};

export default function Library() {
  const [filter, setFilter] = useState<Filter>('All');
  const [view, setView] = useState<View>('grid');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [detail, setDetail] = useState<typeof ASSETS[0]|null>(null);
  const navigate = useNavigate();

  const visible = ASSETS.filter(a => {
    if (filter !== 'All' && a.type !== filter.toLowerCase().replace(/s$/,'')) return false;
    if (q && !a.title.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  function toggleSel(id:number) {
    setSelected(s => { const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n; });
  }

  return (
    <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column' }}>
      {/* Toolbar */}
      <div style={{ height:58, flex:'none', display:'flex', alignItems:'center', gap:10, padding:'0 20px', borderBottom:`1px solid ${T.borderFaint}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flex:1, height:36, padding:'0 12px', borderRadius:9, background:T.panelMid, border:`1px solid ${T.borderLight}`, color:T.textFaint, fontSize:13 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search library..." style={{ flex:1, border:0, outline:0, background:'transparent', color:T.text, fontSize:13 }} />
        </div>
        <div style={{ display:'flex', gap:2 }}>
          {(['All','Videos','Images','Audio','Drafts'] as Filter[]).map(f => (
            <button key={f} onClick={()=>setFilter(f)} style={{ height:32, padding:'0 14px', borderRadius:8, border:`1px solid ${f===filter?T.violetDim:T.border}`, background:f===filter?T.violetBg:'transparent', color:f===filter?T.violet:T.textMuted, font:`500 13px ${T.sans}`, cursor:'pointer' }}>{f}</button>
          ))}
        </div>
        <div style={{ width:1, height:24, background:T.border }} />
        <div style={{ display:'flex', gap:2 }}>
          {(['grid','list'] as View[]).map(v => (
            <button key={v} onClick={()=>setView(v)} style={{ width:32, height:32, borderRadius:8, border:`1px solid ${v===view?T.border:'transparent'}`, background:v===view?T.panel:'transparent', color:v===view?T.text:T.textMuted, display:'grid', placeItems:'center', cursor:'pointer', fontSize:14 }}>
              {v==='grid'?'⊞':'≡'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, minHeight:0, display:'flex' }}>
        {/* Main */}
        <div style={{ flex:1, minHeight:0, overflow:'auto', padding:20 }}>
          {selected.size > 0 && (
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16, padding:'10px 16px', borderRadius:10, background:T.violetBg, border:`1px solid ${T.violetDim}` }}>
              <span style={{ fontSize:13, fontWeight:600, color:T.violet }}>{selected.size} selected</span>
              <div style={{ flex:1 }} />
              {['Download','Duplicate','Delete'].map(a=>(
                <button key={a} style={{ height:30, padding:'0 12px', borderRadius:7, border:`1px solid ${a==='Delete'?T.coral:T.border}`, background:'transparent', color:a==='Delete'?T.coral:T.textMid, font:`500 12px ${T.sans}`, cursor:'pointer' }}>{a}</button>
              ))}
            </div>
          )}

          {visible.length === 0 ? (
            <div style={{ height:300, display:'grid', placeItems:'center', color:T.textMuted, fontSize:14 }}>No assets match "{q}"</div>
          ) : view==='grid' ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12 }}>
              {visible.map(a => (
                <div key={a.id} style={{ borderRadius:12, background:T.panel, border:`1px solid ${selected.has(a.id)?T.violetDim:T.border}`, overflow:'hidden', cursor:'pointer', position:'relative' }}
                  onClick={()=>setDetail(a)}>
                  <div onClick={e=>{e.stopPropagation();toggleSel(a.id);}} style={{ position:'absolute', top:8, left:8, width:20, height:20, borderRadius:5, border:`1.5px solid ${selected.has(a.id)?T.violet:T.borderLight}`, background:selected.has(a.id)?T.violet:'oklch(0.16 0.02 285 / .8)', display:'grid', placeItems:'center', zIndex:1, cursor:'pointer' }}>
                    {selected.has(a.id) && <span style={{ color:T.bg, fontSize:11, fontWeight:700 }}>✓</span>}
                  </div>
                  <div style={{ height:a.ratio==='9:16'?160:120, background:'repeating-linear-gradient(135deg,oklch(0.22 0.03 285) 0 10px,oklch(0.24 0.035 285) 10px 20px)', display:'grid', placeItems:'center', fontFamily:T.mono, fontSize:11, color:T.textFaint }}>
                    {a.type==='audio'?'♪ AUDIO':a.ratio}
                  </div>
                  <div style={{ padding:'10px 12px' }}>
                    <div style={{ fontSize:13, fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.title}</div>
                    <div style={{ display:'flex', gap:8, marginTop:6, alignItems:'center' }}>
                      <span style={{ padding:'2px 7px', borderRadius:5, fontSize:11, background:BADGE[a.type]?.bg, color:BADGE[a.type]?.c }}>{a.type}</span>
                      <span style={{ fontSize:12, color:T.textMuted }}>{a.dur}</span>
                      <span style={{ fontSize:12, color:T.textMuted, marginLeft:'auto' }}>{a.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
              {visible.map(a => (
                <div key={a.id} onClick={()=>setDetail(a)} style={{ display:'flex', alignItems:'center', gap:14, padding:'10px 12px', borderRadius:10, background:T.panel, border:`1px solid ${selected.has(a.id)?T.violetDim:T.border}`, cursor:'pointer' }}>
                  <input type="checkbox" checked={selected.has(a.id)} onClick={e=>e.stopPropagation()} onChange={()=>toggleSel(a.id)} />
                  <div style={{ width:60, height:38, borderRadius:6, background:'repeating-linear-gradient(135deg,oklch(0.22 0.03 285) 0 8px,oklch(0.24 0.035 285) 8px 16px)', display:'grid', placeItems:'center', fontFamily:T.mono, fontSize:10, color:T.textFaint }}>{a.ratio}</div>
                  <span style={{ flex:1, fontSize:13, fontWeight:500 }}>{a.title}</span>
                  <span style={{ padding:'2px 7px', borderRadius:5, fontSize:11, background:BADGE[a.type]?.bg, color:BADGE[a.type]?.c }}>{a.type}</span>
                  <span style={{ fontFamily:T.mono, fontSize:12, color:T.textMuted, width:40 }}>{a.dur}</span>
                  <span style={{ fontFamily:T.mono, fontSize:12, color:T.textMuted, width:44 }}>{a.res}</span>
                  <span style={{ fontSize:12, color:T.textMuted, width:60 }}>{a.date}</span>
                  <button onClick={e=>{e.stopPropagation();}} style={{ background:'transparent', border:0, color:T.textMuted, cursor:'pointer', fontSize:18 }}>⋯</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail drawer */}
        {detail && (
          <div style={{ width:320, flex:'none', borderLeft:`1px solid ${T.borderFaint}`, display:'flex', flexDirection:'column' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderBottom:`1px solid ${T.borderFaint}` }}>
              <span style={{ fontSize:14, fontWeight:600 }}>Details</span>
              <button onClick={()=>setDetail(null)} style={{ background:'transparent', border:0, color:T.textMuted, cursor:'pointer', fontSize:18, lineHeight:1 }}>×</button>
            </div>
            <div style={{ flex:1, overflow:'auto', padding:16, display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ height:160, borderRadius:10, background:'repeating-linear-gradient(135deg,oklch(0.22 0.03 285) 0 12px,oklch(0.24 0.035 285) 12px 24px)', display:'grid', placeItems:'center', fontFamily:T.mono, fontSize:11, color:T.textFaint }}>{detail.ratio} PREVIEW</div>
              <div>
                <div style={{ fontSize:15, fontWeight:600 }}>{detail.title}</div>
                <div style={{ display:'flex', gap:10, marginTop:8, flexWrap:'wrap' }}>
                  {[['Type',detail.type],['Duration',detail.dur],['Resolution',detail.res],['Date',detail.date]].map(([k,v])=>(
                    <div key={k} style={{ fontSize:12 }}><span style={{ color:T.textMuted }}>{k}: </span><span style={{ color:T.text }}>{v}</span></div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>Prompt</div>
                <div style={{ fontSize:12, lineHeight:1.55, color:T.textMid, padding:10, borderRadius:8, background:T.panelDark, border:`1px solid ${T.border}` }}>
                  A cinematic whale rising from the ocean, neon glow, dramatic lighting, 10 seconds...
                </div>
              </div>
              <div style={{ display:'flex', gap:6, flexDirection:'column' }}>
                <button onClick={()=>navigate('/create')} style={{ height:36, borderRadius:9, border:0, background:T.violet, color:T.bg, font:`600 13px ${T.sans}`, cursor:'pointer' }}>Open in Studio</button>
                <button style={{ height:36, borderRadius:9, border:`1px solid ${T.border}`, background:'transparent', color:T.textMid, font:`500 13px ${T.sans}`, cursor:'pointer' }}>Download</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
