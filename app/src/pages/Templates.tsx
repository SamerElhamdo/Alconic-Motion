import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';

const CATS = ['All','Product','Social','Brand intro','Music visual','Explainer','Event'];

const TEMPLATES = [
  { id:1, name:'Product Launch',      cat:'Product',     dur:'15s', ratio:'9:16', cost:60,  fields:['Product name','Tagline','Brand color'] },
  { id:2, name:'Brand Intro',         cat:'Brand intro', dur:'10s', ratio:'16:9', cost:45,  fields:['Company name','Slogan'] },
  { id:3, name:'Social Reel',         cat:'Social',      dur:'30s', ratio:'9:16', cost:80,  fields:['Topic','Style','Target audience'] },
  { id:4, name:'Music Visual',        cat:'Music visual',dur:'60s', ratio:'1:1',  cost:120, fields:['Song name','Artist','Mood'] },
  { id:5, name:'Explainer',           cat:'Explainer',   dur:'90s', ratio:'16:9', cost:180, fields:['Product name','Key benefit','Call to action'] },
  { id:6, name:'Event Highlight',     cat:'Event',       dur:'45s', ratio:'16:9', cost:100, fields:['Event name','Date','Location'] },
  { id:7, name:'Product Demo',        cat:'Product',     dur:'60s', ratio:'16:9', cost:130, fields:['Product name','Feature 1','Feature 2'] },
  { id:8, name:'Story Ad',            cat:'Social',      dur:'15s', ratio:'9:16', cost:55,  fields:['Brand name','Offer','Deadline'] },
];

export default function Templates() {
  const [cat, setCat] = useState('All');
  const [preview, setPreview] = useState<typeof TEMPLATES[0]|null>(null);
  const navigate = useNavigate();

  const visible = TEMPLATES.filter(t => cat==='All' || t.cat===cat);

  return (
    <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column' }}>
      {/* Category bar */}
      <div style={{ height:56, flex:'none', display:'flex', alignItems:'center', gap:8, padding:'0 20px', borderBottom:`1px solid ${T.borderFaint}`, overflowX:'auto' }}>
        {CATS.map(c => (
          <button key={c} onClick={()=>setCat(c)} style={{ flex:'none', height:32, padding:'0 16px', borderRadius:20, border:`1px solid ${c===cat?T.violetDim:T.border}`, background:c===cat?T.violetBg:'transparent', color:c===cat?T.violet:T.textMuted, font:`500 13px ${T.sans}`, cursor:'pointer' }}>{c}</button>
        ))}
      </div>

      <div style={{ flex:1, minHeight:0, overflow:'auto', padding:24 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16 }}>
          {visible.map(t => (
            <div key={t.id} style={{ borderRadius:14, background:T.panel, border:`1px solid ${T.border}`, overflow:'hidden', cursor:'pointer' }} onClick={()=>setPreview(t)}>
              <div style={{ height:140, background:`repeating-linear-gradient(135deg,oklch(0.22 0.03 285) 0 12px,oklch(0.24 0.035 285) 12px 24px)`, display:'grid', placeItems:'center', fontFamily:T.mono, fontSize:11, color:T.textFaint, position:'relative' }}>
                <span>PREVIEW · {t.ratio}</span>
                <span style={{ position:'absolute', top:10, right:10, padding:'3px 8px', borderRadius:6, background:T.panelDark, fontFamily:T.mono, fontSize:11, color:T.textFaint }}>{t.dur}</span>
              </div>
              <div style={{ padding:'12px 14px 14px' }}>
                <div style={{ fontSize:14, fontWeight:600 }}>{t.name}</div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8 }}>
                  <span style={{ fontSize:12, color:T.textMuted }}>{t.cat}</span>
                  <span style={{ fontFamily:T.mono, fontSize:12, color:T.violet }}>~{t.cost} cr</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview modal */}
      {preview && (
        <div onClick={()=>setPreview(null)} style={{ position:'fixed', inset:0, background:'oklch(0 0 0 / .7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }}>
          <div onClick={e=>e.stopPropagation()} style={{ width:640, borderRadius:20, background:T.panel, border:`1px solid ${T.border}`, overflow:'hidden', display:'flex', flexDirection:'column' }}>
            <div style={{ height:280, background:'repeating-linear-gradient(135deg,oklch(0.22 0.03 285) 0 12px,oklch(0.24 0.035 285) 12px 24px)', display:'grid', placeItems:'center', fontFamily:T.mono, fontSize:13, color:T.textFaint, position:'relative' }}>
              PREVIEW · {preview.ratio}
              <button style={{ position:'absolute', top:14, right:14, width:32, height:32, borderRadius:'50%', border:`1px solid ${T.border}`, background:'oklch(0.16 0.02 285 / .8)', color:T.textMuted, display:'grid', placeItems:'center', cursor:'pointer', fontSize:18 }} onClick={()=>setPreview(null)}>×</button>
            </div>
            <div style={{ padding:24, display:'flex', flexDirection:'column', gap:20 }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontSize:20, fontWeight:700 }}>{preview.name}</div>
                  <div style={{ display:'flex', gap:12, marginTop:8, fontSize:13, color:T.textMuted }}>
                    <span>{preview.dur}</span><span>{preview.ratio}</span><span>~{preview.cost} credits</span>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>Editable fields</div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {preview.fields.map(f => (
                    <div key={f}>
                      <label style={{ fontSize:12, color:T.textMuted, display:'block', marginBottom:4 }}>{f}</label>
                      <input placeholder={`Enter ${f.toLowerCase()}...`} style={{ width:'100%', height:36, padding:'0 12px', borderRadius:8, border:`1px solid ${T.borderLight}`, background:T.panelDark, color:T.text, fontSize:13, outline:'none' }} />
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={()=>navigate('/create')} style={{ height:44, borderRadius:10, border:0, background:T.violet, color:T.bg, font:`600 15px ${T.sans}`, cursor:'pointer' }}>
                Use this template →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
