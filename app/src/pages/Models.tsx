import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';

const MODELS = [
  {
    id:'seedance-2.5', name:'Seedance 2.5', tag:'Recommended', locked:false,
    desc:'Best-in-class motion coherence and prompt adherence. Handles complex camera paths.',
    maxRes:'1080p', maxDur:'120s', crPerSec:9.8,
    strengths:['Camera control','Prompt fidelity','Long-form coherence','Motion dynamics'],
  },
  {
    id:'seedance-1', name:'Seedance 1', tag:'Fast', locked:false,
    desc:'Faster generation with solid quality. Great for drafts and quick iterations.',
    maxRes:'720p', maxDur:'60s', crPerSec:4.5,
    strengths:['Fast output','Low cost','Draft quality'],
  },
  {
    id:'wan-i2v', name:'Wan I2V 2.1', tag:'Image-to-Video', locked:false,
    desc:'Animate a reference image with high temporal consistency and natural motion.',
    maxRes:'1080p', maxDur:'30s', crPerSec:7.2,
    strengths:['Image fidelity','Natural motion','Face preservation'],
  },
  {
    id:'lumina-ultra', name:'Lumina Ultra', tag:'Pro only', locked:true,
    desc:'Cutting-edge photorealistic rendering. Available on Pro and Studio plans.',
    maxRes:'4K', maxDur:'60s', crPerSec:22,
    strengths:['Photorealism','4K output','HDR lighting'],
  },
];

const UPSCALERS = [
  { id:'topaz-4k', name:'Topaz 4K', desc:'State-of-the-art AI upscaling from HD to 4K', cost:'30 cr/min' },
  { id:'esrgan', name:'ESRGAN x2', desc:'Open-source upscaling, lighter cost', cost:'12 cr/min' },
];

const COMPARE_ROWS = [
  ['Max resolution','1080p','720p','1080p'],
  ['Max duration','120s','60s','30s'],
  ['Credits/sec','9.8','4.5','7.2'],
  ['Camera control','✓','–','–'],
  ['Image-to-video','–','–','✓'],
];

export default function Models() {
  const [def, setDef] = useState('seedance-2.5');
  const navigate = useNavigate();

  return (
    <div style={{ flex:1, minHeight:0, overflow:'auto' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'28px 24px' }}>

        {/* Video models */}
        <h2 style={{ fontSize:22, fontWeight:700, letterSpacing:'-.02em', marginBottom:6 }}>Video Models</h2>
        <p style={{ fontSize:14, color:T.textMuted, marginBottom:24 }}>Choose your default model for new projects. Each model has different strengths and credit costs.</p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16, marginBottom:40 }}>
          {MODELS.map(m => (
            <div key={m.id} style={{
              borderRadius:16, background:T.panel,
              border:`1px solid ${def===m.id?T.violetDim:T.border}`,
              padding:20, display:'flex', flexDirection:'column', gap:14,
              opacity: m.locked ? 0.65 : 1, position:'relative',
            }}>
              {m.locked && (
                <div style={{ position:'absolute', inset:0, borderRadius:16, background:'oklch(0.14 0.02 285 / .5)', display:'grid', placeItems:'center', zIndex:1 }}>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:28, marginBottom:8 }}>🔒</div>
                    <div style={{ fontSize:13, color:T.textMuted }}>Upgrade to Pro</div>
                  </div>
                </div>
              )}
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
                <div>
                  <div style={{ fontSize:16, fontWeight:700 }}>{m.name}</div>
                  <span style={{ padding:'2px 8px', borderRadius:5, fontSize:11, background:def===m.id?T.mintBg:'oklch(0.25 0.03 285)', color:def===m.id?T.mint:T.textMuted }}>{def===m.id?'Default':m.tag}</span>
                </div>
                <span style={{ fontFamily:T.mono, fontSize:13, fontWeight:600, color:T.violet }}>{m.crPerSec} cr/s</span>
              </div>
              <p style={{ fontSize:13, color:T.textMuted, lineHeight:1.55 }}>{m.desc}</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {[['Max res',m.maxRes],['Max dur',m.maxDur]].map(([k,v])=>(
                  <div key={k} style={{ padding:'8px 10px', borderRadius:8, background:T.panelDark, border:`1px solid ${T.border}` }}>
                    <div style={{ fontSize:11, color:T.textFaint, marginBottom:2 }}>{k}</div>
                    <div style={{ fontFamily:T.mono, fontSize:13, fontWeight:600 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize:11, color:T.textFaint, marginBottom:8 }}>Strengths</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {m.strengths.map(s=>(
                    <span key={s} style={{ padding:'3px 9px', borderRadius:5, fontSize:12, background:'oklch(0.24 0.03 285)', color:T.textMid }}>{s}</span>
                  ))}
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button disabled={m.locked} onClick={()=>!m.locked&&setDef(m.id)} style={{ flex:1, height:34, borderRadius:8, border:`1px solid ${T.border}`, background:def===m.id?T.mintBg:'transparent', color:def===m.id?T.mint:T.textMid, font:`500 13px ${T.sans}`, cursor:m.locked?'default':'pointer' }}>
                  {def===m.id?'✓ Default':'Set as default'}
                </button>
                <button disabled={m.locked} onClick={()=>!m.locked&&navigate('/create')} style={{ height:34, padding:'0 12px', borderRadius:8, border:0, background:m.locked?T.panelDark:T.violetBg, color:m.locked?T.textFaint:T.violet, font:`500 13px ${T.sans}`, cursor:m.locked?'default':'pointer' }}>
                  Try →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <h3 style={{ fontSize:17, fontWeight:600, marginBottom:16 }}>Model comparison</h3>
        <div style={{ borderRadius:14, background:T.panel, border:`1px solid ${T.border}`, overflow:'hidden', marginBottom:40 }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ background:T.panelDark }}>
                <th style={{ padding:'12px 16px', textAlign:'left', color:T.textMuted, fontWeight:500 }}>Feature</th>
                {MODELS.slice(0,3).map(m => (
                  <th key={m.id} style={{ padding:'12px 16px', textAlign:'center', fontWeight:600, color:def===m.id?T.violet:T.text }}>{m.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map(([feat,...vals],ri) => (
                <tr key={feat} style={{ borderTop:`1px solid ${T.borderFaint}`, background:ri%2?T.panelDark:'transparent' }}>
                  <td style={{ padding:'10px 16px', color:T.textMuted }}>{feat}</td>
                  {vals.map((v,vi) => (
                    <td key={vi} style={{ padding:'10px 16px', textAlign:'center', fontFamily:T.mono, color:v==='✓'?T.mint:v==='–'?T.textFaint:T.text }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Upscalers */}
        <h3 style={{ fontSize:17, fontWeight:600, marginBottom:16 }}>Upscalers</h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          {UPSCALERS.map(u => (
            <div key={u.id} style={{ borderRadius:14, background:T.panel, border:`1px solid ${T.border}`, padding:'18px 20px', display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:600 }}>{u.name}</div>
                <div style={{ fontSize:13, color:T.textMuted, marginTop:4 }}>{u.desc}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:T.mono, fontSize:14, fontWeight:600, color:T.violet }}>{u.cost}</div>
                <button style={{ marginTop:8, height:30, padding:'0 12px', borderRadius:7, border:`1px solid ${T.border}`, background:'transparent', color:T.textMid, font:`500 12px ${T.sans}`, cursor:'pointer' }}>Configure</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
