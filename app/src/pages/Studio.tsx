import { useState, useEffect, useRef } from 'react';
import { T } from '../tokens';
import { AgentRobot } from '../components/AgentRobot';

const AGENTS = [
  { n: 'Story',  d: 'Analyzing your idea and building the story...',     h: 295 },
  { n: 'Motion', d: 'Planning camera moves and animation flow...',        h: 255 },
  { n: 'Assets', d: 'Generating and preparing visual assets...',          h: 205 },
  { n: 'Audio',  d: 'Designing sound, SFX and music...',                  h: 335 },
  { n: 'Vision', d: 'Compositing, lighting and applying style...',        h: 275 },
  { n: 'QC',     d: 'Final check and optimization...',                    h: 165 },
  { n: 'Render', d: 'Encoding and delivering the final cut...',           h: 70  },
];

type Phase = 'idle'|'directing'|'storyboard'|'generating'|'preview'|'error'|'done';
const CODE: Record<Phase,string> = {
  idle:'wwwwwww', directing:'', storyboard:'dddwwww',
  generating:'ddddkww', preview:'dddddkw', error:'dddfwww', done:'ddddddd',
};
const CTA: Record<Phase,string> = {
  idle:'Start directing', directing:'Directing…', storyboard:'Approve storyboard',
  generating:'Generating…', preview:'Approve & render', error:'Retry audio', done:'Download MP4',
};
const NEXT: Record<Phase,Phase> = {
  idle:'directing', directing:'storyboard', storyboard:'generating',
  generating:'preview', preview:'done', error:'generating', done:'done',
};
const SCENES = [
  { n:1, t:'0s',  c:'Deep ocean, particles drift' },
  { n:2, t:'3s',  c:'Light pulses below' },
  { n:3, t:'5s',  c:'Energy sphere forms' },
  { n:4, t:'8s',  c:'Whale silhouette emerges' },
  { n:5, t:'11s', c:'Whale breaches the surface' },
  { n:6, t:'14s', c:'Neon spray, brand reveal' },
];
const STYLES = ['Cinematic','3D Render','Anime','Realistic','Abstract'];
const PAL = ['oklch(0.45 0.2 265)','oklch(0.62 0.22 295)','oklch(0.72 0.2 350)','oklch(0.78 0.13 230)','oklch(0.85 0.06 295)'];
const EX = 'A cinematic whale rising from the ocean, neon glow, 10 seconds';
const WAVE = Array.from({length:90},(_,i)=>Math.round(4+Math.abs(Math.sin(i*.41)*Math.cos(i*.13))*26+(i*7%5)));

export default function Studio() {
  const [phase, setPhase] = useState<Phase>('preview');
  const [idea, setIdea] = useState(EX);
  const [tick, setTick] = useState(0);
  const [gen, setGen] = useState(0);
  const [t, setT] = useState(11.85);
  const [playing, setPlaying] = useState(false);
  const [tab, setTab] = useState('Content');
  const [style, setStyle] = useState(0);
  const [color, setColor] = useState(1);
  const [media, setMedia] = useState(0);
  const iv = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    iv.current = window.setInterval(() => {
      setTick(tk => phase === 'directing' ? Math.min(tk+1,245) : tk);
      setGen(g => phase === 'generating' ? (g>=100?100:g+0.5) : g);
      setT(cur => {
        if (!playing) return cur;
        const next = cur + 0.1;
        if (next >= 16) { setPlaying(false); return 16; }
        return next;
      });
    }, 100);
    return () => clearInterval(iv.current);
  }, [phase, playing]);

  function go(p: Phase) { setPhase(p); setTick(0); setGen(0); setPlaying(false); }

  const codeStr = phase === 'directing' ? '' : CODE[phase];
  const agentData = AGENTS.map((a,i) => {
    let st: 'done'|'work'|'wait'|'fail' = 'wait';
    let pct = 0;
    if (codeStr) {
      const ch = codeStr[i];
      st = ({d:'done',w:'wait',k:'work',f:'fail'} as any)[ch] ?? 'wait';
      if (st === 'work') pct = phase === 'generating' ? gen : 64;
    } else {
      if (i<4 && tick>=(i+1)*60) st='done';
      else if (i<4 && tick>=i*60) { st='work'; pct=(tick-i*60)/60*100; }
      else st='wait';
    }
    return { ...a, st, pct };
  });

  const busy = phase==='directing'?tick<240 : phase==='generating'?gen<100:false;
  const pp = t/16*100;
  const sec = Math.floor(t);
  const cs = Math.round((t%1)*100);
  const hasTimeline = ['storyboard','generating','preview','error','done'].includes(phase);


  const STATES: [Phase,string][] = [
    ['idle','Idle'],['directing','Directing'],['storyboard','Storyboard'],
    ['generating','Generating'],['preview','Preview'],['error','Error'],['done','Rendered'],
  ];

  return (
    <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column' }}>
      {/* State bar */}
      <div style={{ height:38, flex:'none', display:'flex', alignItems:'center', gap:12, padding:'0 20px', background:T.bgDeep, borderBottom:`1px solid oklch(0.26 0.03 285)` }}>
        <span style={{ fontFamily:T.mono, fontSize:11, letterSpacing:'.08em', textTransform:'uppercase', color:T.textFaint }}>Studio states</span>
        <div style={{ display:'flex', gap:4 }}>
          {STATES.map(([id,label],i) => {
            const on = id===phase;
            return (
              <button key={id} onClick={()=>go(id)} style={{
                display:'flex', alignItems:'center', gap:6, height:26, padding:'0 10px', borderRadius:7,
                border:`1px solid ${on?T.violetDim:T.border}`,
                background: on?T.violetBg:'transparent',
                color: on?T.violet:T.textMuted,
                font:`500 12px ${T.sans}`, cursor:'pointer',
              }}>
                <span style={{ fontFamily:T.mono, fontSize:11, opacity:.7 }}>{i+1}</span>{label}
              </button>
            );
          })}
        </div>
      </div>

      <main style={{ flex:1, minHeight:0, display:'grid', gridTemplateColumns:'340px minmax(0,1fr) 360px', gap:12, padding:12 }}>

        {/* Left: AI Director */}
        <section style={{ minHeight:0, display:'flex', flexDirection:'column', borderRadius:16, background:T.panel, border:`1px solid ${T.border}` }}>
          <div style={{ padding:'18px 18px 12px', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
            <div>
              <div style={{ fontSize:19, fontWeight:600, letterSpacing:'-.01em' }}>AI Director</div>
              <div style={{ fontSize:13, color:T.textMuted, marginTop:3 }}>Your creative partner from idea to the final render.</div>
            </div>
            <span style={{ fontFamily:T.mono, fontSize:11, padding:'4px 8px', borderRadius:6, background:'oklch(0.24 0.03 285)', color:T.textMid, whiteSpace:'nowrap' }}>
              {agentData.filter(a=>a.st==='done').length}/7
            </span>
          </div>

          <div style={{ flex:1, minHeight:0, overflow:'auto', padding:'0 12px 12px', display:'flex', flexDirection:'column', gap:6 }}>
            {agentData.map(a => (
              <div key={a.n} style={{
                display:'flex', alignItems:'center', gap:12, padding:'9px 12px 9px 9px',
                borderRadius:12,
                background: a.st==='work'?'oklch(0.22 0.04 290)':'oklch(0.2 0.02 285)',
                border: `1px solid ${a.st==='work'?T.violetDim:a.st==='fail'?'oklch(0.72 0.17 25 / .5)':T.borderFaint}`,
              }}>
                <AgentRobot name={a.n} status={a.st} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:600 }}>{AGENTS.indexOf(a)+1}. {a.n}</div>
                  <div style={{ fontSize:12, color:T.textMuted, marginTop:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.d}</div>
                  {a.st==='work' && (
                    <div style={{ height:3, borderRadius:2, background:'oklch(0.28 0.03 285)', marginTop:7, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${a.pct}%`, background:T.violet }} />
                    </div>
                  )}
                </div>
                <div style={{ flex:'none', display:'flex', alignItems:'center', gap:6, fontSize:12, color: a.st==='fail'?T.coral:a.st==='wait'?T.textFaint:T.textMid }}>
                  {a.st==='done' && <span style={{ width:16,height:16,borderRadius:'50%',background:T.mint,color:T.bg,display:'grid',placeItems:'center',fontSize:10,fontWeight:700 }}>✓</span>}
                  {a.st==='work' && <span className="spinner" />}
                  {a.st==='wait' && <span style={{ width:14,height:14,borderRadius:'50%',border:`1.5px dashed oklch(0.55 0.03 285)` }} />}
                  {a.st==='fail' && <span style={{ width:16,height:16,borderRadius:'50%',background:T.coral,color:T.bg,display:'grid',placeItems:'center',fontSize:11,fontWeight:700 }}>!</span>}
                  {a.st==='done'?'Done':a.st==='work'?`Working ${Math.round(a.pct)}%`:a.st==='wait'?'Waiting':'Failed'}
                </div>
              </div>
            ))}
          </div>

          <div style={{ margin:'0 12px 12px', padding:12, borderRadius:14, background:T.panelDark, border:`1px solid ${phase==='idle'?'oklch(0.6 0.17 295 / .8)':T.border}` }}>
            <textarea value={idea} onChange={e=>setIdea(e.target.value)} placeholder="Describe your video idea..." rows={2}
              style={{ width:'100%', resize:'none', border:0, outline:0, background:'transparent', color:T.text, fontSize:14, lineHeight:1.45 }} />
            <div style={{ fontSize:12, color:T.textFaint, margin:'2px 0 10px' }}>Try: "A cinematic whale rising from the ocean, neon glow, 10 seconds..."</div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <button onClick={()=>setIdea(EX)} style={{ height:28,padding:'0 10px',borderRadius:7,border:`1px solid ${T.borderLight}`,background:'oklch(0.2 0.02 285)',color:T.textMid,font:`500 12px ${T.sans}`,cursor:'pointer' }}>Inspire me</button>
              <button style={{ height:28,padding:'0 10px',borderRadius:7,border:`1px solid ${T.borderLight}`,background:'oklch(0.2 0.02 285)',color:T.textMid,font:`500 12px ${T.sans}`,cursor:'pointer' }}>Improve prompt</button>
              <div style={{ flex:1 }} />
              <button style={{ width:38,height:38,borderRadius:'50%',border:0,background:T.violet,color:T.bg,display:'grid',placeItems:'center',cursor:'pointer' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>
              </button>
            </div>
          </div>
        </section>

        {/* Center: Preview */}
        <section style={{ minHeight:0, display:'flex', flexDirection:'column', borderRadius:16, background:T.panel, border:`1px solid ${T.border}`, overflow:'hidden' }}>
          <div style={{ height:52, flex:'none', display:'flex', alignItems:'center', gap:10, padding:'0 16px' }}>
            <span style={{ fontSize:15, fontWeight:600 }}>Preview</span>
            <span style={{ fontFamily:T.mono, fontSize:11, padding:'3px 8px', borderRadius:6,
              background: phase==='done'?T.mintBg:phase==='error'?T.coralBg:phase==='idle'?'oklch(0.25 0.03 285)':'oklch(0.3 0.08 295)',
              color: phase==='done'?T.mint:phase==='error'?T.coral:phase==='idle'?T.textMid:'oklch(0.88 0.08 295)',
            }}>
              {phase==='done'?'Rendered · 1080p':phase==='error'?'Audio failed':phase==='idle'?'Empty':phase==='storyboard'?'Storyboard · 6 scenes':phase==='generating'?'Generating':'Draft · 720p'}
            </span>
            <div style={{ flex:1 }} />
            <div style={{ height:30,display:'flex',alignItems:'center',padding:'0 10px',borderRadius:8,border:`1px solid ${T.borderLight}`,fontSize:13,color:T.textMid }}>16:9 ▾</div>
            <div style={{ height:30,display:'flex',alignItems:'center',padding:'0 10px',borderRadius:8,border:`1px solid ${T.borderLight}`,fontSize:13,color:T.textMid }}>720p ▾</div>
          </div>

          <div style={{ flex:1, minHeight:0, padding:'0 16px', display:'flex' }}>
            <div style={{ position:'relative', flex:1, borderRadius:12, overflow:'hidden',
              background:'repeating-linear-gradient(135deg,oklch(0.2 0.03 285) 0 12px,oklch(0.22 0.035 285) 12px 24px)',
              border:`1px solid ${T.borderLight}` }}>

              {phase==='idle' && (
                <div style={{ position:'absolute',inset:0,display:'grid',placeItems:'center',background:'oklch(0.16 0.02 285 / .88)' }}>
                  <div style={{ textAlign:'center',maxWidth:360 }}>
                    <div style={{ fontSize:22,fontWeight:600,letterSpacing:'-.01em' }}>Start with an idea</div>
                    <div style={{ fontSize:14,color:T.textMuted,marginTop:8,lineHeight:1.5 }}>Describe your video in the AI Director panel. Seven agents will take it from story to final render.</div>
                    <button onClick={()=>setIdea(EX)} style={{ marginTop:18,height:36,padding:'0 16px',borderRadius:9,border:`1px solid oklch(0.4 0.08 295)`,background:T.violetBg,color:T.text,font:`500 13px ${T.sans}`,cursor:'pointer' }}>Use example prompt</button>
                  </div>
                </div>
              )}
              {phase==='directing' && (
                <div style={{ position:'absolute',inset:0,display:'grid',placeItems:'center',background:'oklch(0.16 0.02 285 / .8)' }}>
                  <div style={{ textAlign:'center' }}>
                    <span className="spinner-lg" style={{ display:'block',margin:'0 auto' }} />
                    <div style={{ fontSize:20,fontWeight:600,marginTop:16 }}>Directing your video</div>
                    <div style={{ fontSize:14,color:T.textMuted,marginTop:6 }}>
                      {(() => { const wi=agentData.findIndex(a=>a.st==='work'); return wi>=0?`${AGENTS[wi].n} agent · ${AGENTS[wi].d}`:'Storyboard ready for review'; })()}
                    </div>
                  </div>
                </div>
              )}
              {phase==='storyboard' && (
                <div style={{ position:'absolute',inset:0,padding:16,display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gridTemplateRows:'repeat(2,minmax(0,1fr))',gap:12,background:'oklch(0.16 0.02 285)' }}>
                  {SCENES.map(sc => (
                    <div key={sc.n} style={{ display:'flex',flexDirection:'column',gap:6,minHeight:0 }}>
                      <div style={{ flex:1,minHeight:0,borderRadius:9,background:'repeating-linear-gradient(135deg,oklch(0.22 0.03 285) 0 10px,oklch(0.25 0.035 285) 10px 20px)',border:`1px solid ${T.borderLight}`,display:'grid',placeItems:'center',fontFamily:T.mono,fontSize:11,color:T.textFaint }}>SCENE {sc.n} FRAME</div>
                      <div style={{ display:'flex',gap:8,fontSize:12 }}><span style={{ fontFamily:T.mono,color:'oklch(0.8 0.14 295)' }}>{sc.t}</span><span style={{ color:'oklch(0.8 0.02 285)' }}>{sc.c}</span></div>
                    </div>
                  ))}
                </div>
              )}
              {phase==='generating' && (
                <div style={{ position:'absolute',inset:0,display:'grid',placeItems:'center',background:'oklch(0.16 0.02 285 / .72)' }}>
                  <div style={{ width:320,textAlign:'center' }}>
                    <div style={{ fontFamily:T.mono,fontSize:40,fontWeight:500 }}>{Math.round(gen)}%</div>
                    <div style={{ height:4,borderRadius:2,background:'oklch(0.3 0.03 285)',margin:'14px 0 12px',overflow:'hidden' }}>
                      <div style={{ height:'100%',width:`${gen}%`,background:T.violet }} />
                    </div>
                    <div style={{ fontSize:14,color:T.textMid }}>Vision agent · compositing scene {Math.min(6,Math.floor(gen/100*6)+1)} of 6</div>
                  </div>
                </div>
              )}
              {(phase==='preview'||phase==='done') && (
                <div style={{ position:'absolute',inset:0,display:'grid',placeItems:'center' }}>
                  <span style={{ position:'absolute',top:14,left:14,fontFamily:T.mono,fontSize:11,padding:'4px 8px',borderRadius:6,background:'oklch(0.14 0.02 285 / .8)',color:T.textMuted }}>VIDEO PLACEHOLDER · 16:9</span>
                  <button onClick={()=>setPlaying(p=>!p)} style={{ width:68,height:68,borderRadius:'50%',border:`1px solid oklch(1 0 0 / .25)`,background:'oklch(0.14 0.02 285 / .7)',color:T.text,display:'grid',placeItems:'center',cursor:'pointer',fontSize:22 }}>
                    {playing?'❚❚':'▶'}
                  </button>
                </div>
              )}
              {phase==='error' && (
                <div style={{ position:'absolute',inset:0,display:'grid',placeItems:'center',background:'oklch(0.14 0.02 285 / .85)' }}>
                  <div style={{ width:380,padding:20,borderRadius:14,background:'oklch(0.2 0.03 285)',border:`1px solid oklch(0.72 0.17 25 / .5)` }}>
                    <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                      <span style={{ width:22,height:22,borderRadius:'50%',background:T.coral,color:T.bg,display:'grid',placeItems:'center',fontWeight:700,fontSize:13 }}>!</span>
                      <span style={{ fontSize:16,fontWeight:600 }}>Audio agent couldn't finish</span>
                    </div>
                    <div style={{ fontSize:13,color:T.textMid,marginTop:10,lineHeight:1.5 }}>SFX generation timed out on scene 4. Your credits weren't charged.</div>
                    <div style={{ display:'flex',gap:8,marginTop:16 }}>
                      <button onClick={()=>go('generating')} style={{ height:34,padding:'0 14px',borderRadius:8,border:0,background:T.text,color:'oklch(0.16 0.02 285)',font:`600 13px ${T.sans}`,cursor:'pointer' }}>Retry audio</button>
                      <button onClick={()=>go('preview')} style={{ height:34,padding:'0 14px',borderRadius:8,border:`1px solid oklch(0.34 0.03 285)`,background:'transparent',color:'oklch(0.9 0.02 285)',font:`500 13px ${T.sans}`,cursor:'pointer' }}>Skip audio</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {(phase==='preview'||phase==='done') && (
            <div style={{ height:48,flex:'none',display:'flex',alignItems:'center',gap:14,padding:'0 16px' }}>
              <button onClick={()=>setPlaying(p=>!p)} style={{ width:32,height:32,borderRadius:'50%',border:`1px solid oklch(0.34 0.03 285)`,background:'oklch(0.22 0.02 285)',color:T.text,cursor:'pointer',fontSize:12 }}>
                {playing?'❚❚':'▶'}
              </button>
              <span style={{ fontFamily:T.mono,fontSize:13 }}>00:{String(sec).padStart(2,'0')}.{String(cs).padStart(2,'0')} <span style={{ color:T.textFaint }}>/ 00:16.00</span></span>
              <div onClick={e=>{ const r=e.currentTarget.getBoundingClientRect(); setT(Math.max(0,Math.min(16,(e.clientX-r.left)/r.width*16))); }} style={{ position:'relative',flex:1,height:18,display:'flex',alignItems:'center',cursor:'pointer' }}>
                <div style={{ width:'100%',height:4,borderRadius:2,background:'oklch(0.3 0.03 285)' }} />
                <div style={{ position:'absolute',left:0,height:4,borderRadius:2,width:`${pp}%`,background:T.violet }} />
                <div style={{ position:'absolute',left:`${pp}%`,width:14,height:14,marginLeft:-7,borderRadius:'50%',background:T.text }} />
              </div>
              <span style={{ fontSize:13,color:T.textMid }}>1080p ▾</span>
            </div>
          )}

          {/* Timeline */}
          <div style={{ flex:'none',margin:'8px 16px 16px',padding:'10px 12px 12px',borderRadius:12,background:T.panelDark,border:`1px solid ${T.border}` }}>
            {hasTimeline ? (
              <div style={{ position:'relative' }}>
                <div style={{ display:'flex',justifyContent:'space-between',fontFamily:T.mono,fontSize:11,color:T.textFaint,paddingBottom:6 }}>
                  {['0s','2s','4s','6s','8s','10s','12s','14s','16s'].map(r=><span key={r}>{r}</span>)}
                </div>
                <div style={{ display:'grid',gridTemplateColumns:'repeat(6,minmax(0,1fr))',gap:3,height:54 }}>
                  {SCENES.map(sc=>(
                    <div key={sc.n} style={{ borderRadius:6,background:'repeating-linear-gradient(135deg,oklch(0.22 0.03 285) 0 8px,oklch(0.25 0.035 285) 8px 16px)',border:`1px solid ${T.borderLight}`,display:'grid',placeItems:'center',fontFamily:T.mono,fontSize:10,color:T.textFaint }}>S{sc.n}</div>
                  ))}
                </div>
                <div style={{ display:'flex',alignItems:'center',gap:10,marginTop:8 }}>
                  <span style={{ fontSize:12,color:T.textMid,width:130,flex:'none' }}>Ocean Rise <span style={{ color:T.textFaint }}>(SFX only)</span></span>
                  <div style={{ flex:1,height:34,display:'flex',alignItems:'center',gap:2 }}>
                    {WAVE.map((wh,i)=>(
                      <div key={i} style={{ flex:1,height:wh,borderRadius:1,background:i/WAVE.length*100<pp?T.violet:'oklch(0.4 0.06 290)' }} />
                    ))}
                  </div>
                </div>
                <div style={{ position:'absolute',top:18,bottom:0,left:`${pp}%`,width:2,marginLeft:-1,background:T.text,pointerEvents:'none' }} />
              </div>
            ) : (
              <div style={{ height:90,borderRadius:9,border:`1px dashed oklch(0.34 0.03 285)`,display:'grid',placeItems:'center',fontSize:13,color:T.textFaint }}>The timeline builds as agents finish the storyboard.</div>
            )}
          </div>
        </section>

        {/* Right: Settings panel */}
        <section style={{ minHeight:0, display:'flex', flexDirection:'column', borderRadius:16, background:T.panel, border:`1px solid ${T.border}` }}>
          <div style={{ margin:12,padding:4,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:4,borderRadius:11,background:T.panelDark }}>
            {['Content','Brand','Media'].map(l=>{
              const on=l===tab;
              return <button key={l} onClick={()=>setTab(l)} style={{ height:34,borderRadius:8,border:`1px solid ${on?T.violetDim:'transparent'}`,background:on?T.violetBgLight:'transparent',color:on?T.text:T.textMuted,font:`500 13px ${T.sans}`,cursor:'pointer' }}>{l}</button>;
            })}
          </div>

          <div style={{ flex:1,minHeight:0,overflow:'auto',padding:'4px 16px 16px',display:'flex',flexDirection:'column',gap:18 }}>
            {tab==='Content' && <>
              <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
                <div style={{ fontSize:13,fontWeight:600 }}>Prompt</div>
                <div style={{ padding:12,borderRadius:10,background:T.panelDark,border:`1px solid oklch(0.28 0.03 285)`,fontSize:13,lineHeight:1.55,color:'oklch(0.9 0.02 285)' }}>
                  {idea || 'Describe your video idea in the AI Director panel.'}
                  <div style={{ textAlign:'right',fontFamily:T.mono,fontSize:10,color:T.textFaint,marginTop:6 }}>{(idea||'').length}/1000</div>
                </div>
              </div>
              <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
                <div style={{ fontSize:13,fontWeight:600 }}>Negative prompt</div>
                <div style={{ padding:12,borderRadius:10,background:T.panelDark,border:`1px solid oklch(0.28 0.03 285)`,fontSize:13,color:'oklch(0.9 0.02 285)' }}>text, logo, watermark, low quality, blurry, deformed<div style={{ textAlign:'right',fontFamily:T.mono,fontSize:10,color:T.textFaint,marginTop:6 }}>42/500</div></div>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:8 }}>
                {[['Duration','10 s'],['Aspect ratio','16:9'],['Resolution','720p (HD)']].map(([label,val])=>(
                  <div key={label} style={{ display:'flex',flexDirection:'column',gap:6 }}>
                    <span style={{ fontSize:12,color:T.textMuted }}>{label}</span>
                    <div style={{ height:36,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 10px',borderRadius:8,border:`1px solid ${T.borderLight}`,fontSize:13 }}>{val}<span>▾</span></div>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
                <div style={{ fontSize:13,fontWeight:600 }}>Style</div>
                <div style={{ display:'grid',gridTemplateColumns:'repeat(5,minmax(0,1fr))',gap:6 }}>
                  {STYLES.map((s,i)=>(
                    <button key={s} onClick={()=>setStyle(i)} style={{ display:'flex',flexDirection:'column',gap:5,padding:0,border:0,background:'transparent',cursor:'pointer',color:'oklch(0.86 0.02 285)' }}>
                      <div style={{ width:'100%',aspectRatio:'1',borderRadius:9,background:'repeating-linear-gradient(135deg,oklch(0.22 0.03 285) 0 6px,oklch(0.26 0.04 285) 6px 12px)',outline:`2px solid ${i===style?T.violet:'transparent'}`,outlineOffset:1 }} />
                      <span style={{ font:`500 11px ${T.sans}`,textAlign:'center' }}>{s}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>}

            {tab==='Brand' && <>
              <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
                <div style={{ fontSize:13,fontWeight:600 }}>Color palette</div>
                <div style={{ display:'flex',gap:10 }}>
                  {PAL.map((c,i)=>(
                    <button key={c} onClick={()=>setColor(i)} style={{ width:34,height:34,borderRadius:'50%',border:0,background:c,outline:`2px solid ${i===color?T.text:'transparent'}`,outlineOffset:2,cursor:'pointer' }} />
                  ))}
                </div>
              </div>
              <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
                <div style={{ fontSize:13,fontWeight:600 }}>Brand style</div>
                <div style={{ height:38,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 12px',borderRadius:8,border:`1px solid ${T.borderLight}`,fontSize:13 }}>Alconic (Default)<span>▾</span></div>
              </div>
            </>}

            {tab==='Media' && <>
              <div style={{ padding:4,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:4,borderRadius:10,background:T.panelDark }}>
                {['Upload image','Use from library','Generate with AI'].map((l,i)=>(
                  <button key={l} onClick={()=>setMedia(i)} style={{ height:32,borderRadius:7,border:0,background:i===media?T.violetBgLight:'transparent',color:i===media?T.text:T.textMuted,font:`500 12px ${T.sans}`,cursor:'pointer' }}>{l}</button>
                ))}
              </div>
              <div style={{ padding:'28px 16px',borderRadius:12,border:`1.5px dashed oklch(0.38 0.04 285)`,textAlign:'center' }}>
                <div style={{ fontSize:14,fontWeight:500 }}>Drag & drop an image or video</div>
                <div style={{ fontSize:12,color:T.textFaint,marginTop:4 }}>PNG, JPG, MP4, MOV up to 200 MB</div>
              </div>
            </>}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ height:88,flex:'none',display:'flex',alignItems:'center',gap:24,padding:'0 20px',borderTop:`1px solid ${T.borderFaint}`,background:'oklch(0.16 0.02 285)' }}>
        <div style={{ width:104,height:58,flex:'none',borderRadius:8,background:'repeating-linear-gradient(135deg,oklch(0.22 0.03 285) 0 8px,oklch(0.25 0.035 285) 8px 16px)',display:'grid',placeItems:'center',fontFamily:T.mono,fontSize:10,color:T.textFaint }}>THUMB</div>
        <div style={{ minWidth:0,width:300 }}>
          <div style={{ fontSize:14,fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>A cinematic whale rising from the ocean...</div>
          <div style={{ display:'flex',gap:14,marginTop:6,fontSize:12,color:T.textMuted }}><span>10s</span><span>16:9</span><span>720p</span><span>Cinematic</span></div>
        </div>
        <div style={{ flex:1 }} />
        {[['Video model','Seedance 2.5 · 720p'],['Upscale (optional)','Upscale 4K · Topaz']].map(([label,val])=>(
          <div key={label} style={{ display:'flex',flexDirection:'column',gap:5 }}>
            <span style={{ fontSize:12,color:T.textMuted }}>{label}</span>
            <div style={{ width:200,height:36,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 12px',borderRadius:8,border:`1px solid ${T.borderLight}`,fontSize:13 }}>{val}<span>▾</span></div>
          </div>
        ))}
        <div style={{ width:1,height:44,background:'oklch(0.28 0.03 285)' }} />
        <div style={{ display:'flex',flexDirection:'column',gap:2 }}>
          <span style={{ fontSize:12,color:T.textMuted }}>Estimated cost</span>
          <span style={{ fontSize:22,fontWeight:600,letterSpacing:'-.01em' }}>98 <span style={{ fontSize:15,fontWeight:500 }}>credits</span></span>
        </div>
        <button onClick={()=>{ if(!busy&&phase!=='done') go(NEXT[phase]); }} style={{
          height:50,minWidth:200,padding:'0 22px',borderRadius:12,border:0,
          background: phase==='error'?T.text:phase==='done'?T.mint:T.violet,
          color:T.bg,font:`600 15px ${T.sans}`,cursor:busy?'default':'pointer',
          opacity:busy?0.5:1,
        }}>{CTA[phase]} →</button>
      </footer>
    </div>
  );
}
