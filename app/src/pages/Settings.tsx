import { useState } from 'react';
import { T } from '../tokens';

type Section = 'Profile'|'Brand kit'|'Defaults'|'Notifications'|'API keys'|'Team';

const SECTIONS: Section[] = ['Profile','Brand kit','Defaults','Notifications','API keys','Team'];

const MEMBERS = [
  { name:'Samer Elhamdoo', email:'samer.elhamdoo@icloud.com', role:'Owner', avatar:'SE' },
  { name:'Alex Jordan',    email:'alex@alconic.io',           role:'Editor', avatar:'AJ' },
  { name:'Mia Chen',       email:'mia@alconic.io',            role:'Viewer', avatar:'MC' },
];

export default function Settings() {
  const [section, setSection] = useState<Section>('Profile');
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState('Samer Elhamdoo');
  const [email] = useState('samer.elhamdoo@icloud.com');
  const [defModel, setDefModel] = useState('Seedance 2.5');
  const [defRes, setDefRes] = useState('1080p');
  const [defRatio, setDefRatio] = useState('16:9');
  const [defStyle, setDefStyle] = useState('Cinematic');
  const [apiVisible, setApiVisible] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  function save() { setSaved(true); setTimeout(()=>setSaved(false),2500); }

  const PAL = ['oklch(0.45 0.2 265)','oklch(0.62 0.22 295)','oklch(0.72 0.2 350)','oklch(0.78 0.13 230)'];

  return (
    <div style={{ flex:1, minHeight:0, display:'flex' }}>
      {/* Sidebar */}
      <div style={{ width:200, flex:'none', borderRight:`1px solid ${T.borderFaint}`, padding:'16px 0' }}>
        {SECTIONS.map(s => (
          <button key={s} onClick={()=>setSection(s)} style={{ display:'block', width:'100%', padding:'10px 20px', border:0, background:s===section?T.violetBg:'transparent', color:s===section?T.violet:T.textMuted, textAlign:'left', fontSize:14, fontWeight:s===section?600:400, cursor:'pointer', borderRight:`2px solid ${s===section?T.violet:'transparent'}` }}>{s}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex:1, minHeight:0, overflow:'auto', padding:'28px 32px', maxWidth:640 }}>
        {saved && (
          <div style={{ marginBottom:20, padding:'10px 14px', borderRadius:10, background:T.mintBg, border:`1px solid oklch(0.5 0.12 170 / .5)`, color:T.mint, fontSize:13, fontWeight:600 }}>
            ✓ Changes saved
          </div>
        )}

        {section==='Profile' && (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <h2 style={{ fontSize:20, fontWeight:700 }}>Profile</h2>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ width:72, height:72, borderRadius:'50%', background:'oklch(0.3 0.05 295)', display:'grid', placeItems:'center', fontSize:24, fontWeight:600 }}>SE</div>
              <button style={{ height:34, padding:'0 14px', borderRadius:8, border:`1px solid ${T.border}`, background:'transparent', color:T.textMid, font:`500 13px ${T.sans}`, cursor:'pointer' }}>Change avatar</button>
            </div>
            <Field label="Display name" value={name} onChange={setName} />
            <Field label="Email" value={email} disabled />
            <div>
              <label style={{ fontSize:13, color:T.textMuted, display:'block', marginBottom:6 }}>Password</label>
              <button style={{ height:36, padding:'0 14px', borderRadius:8, border:`1px solid ${T.border}`, background:'transparent', color:T.textMid, font:`500 13px ${T.sans}`, cursor:'pointer' }}>Change password</button>
            </div>
            <SaveBtn onClick={save} />
          </div>
        )}

        {section==='Brand kit' && (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <h2 style={{ fontSize:20, fontWeight:700 }}>Brand kit</h2>
            <div>
              <label style={{ fontSize:13, color:T.textMuted, display:'block', marginBottom:10 }}>Color palette</label>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                {PAL.map(c => <div key={c} style={{ width:36, height:36, borderRadius:'50%', background:c, border:`2px solid ${T.borderLight}`, cursor:'pointer' }} />)}
                <button style={{ width:36, height:36, borderRadius:'50%', border:`2px dashed ${T.borderLight}`, background:'transparent', color:T.textFaint, display:'grid', placeItems:'center', fontSize:20, cursor:'pointer' }}>+</button>
              </div>
            </div>
            <div>
              <label style={{ fontSize:13, color:T.textMuted, display:'block', marginBottom:8 }}>Brand logo</label>
              <div style={{ height:100, borderRadius:12, border:`1.5px dashed ${T.borderLight}`, display:'grid', placeItems:'center', fontSize:13, color:T.textFaint }}>Drag & drop or click to upload</div>
            </div>
            <div>
              <label style={{ fontSize:13, color:T.textMuted, display:'block', marginBottom:8 }}>Brand fonts</label>
              <Select value="Geist (Default)" options={['Geist (Default)','Inter','Helvetica','Custom…']} onChange={()=>{}} />
            </div>
            <div>
              <label style={{ fontSize:13, color:T.textMuted, display:'block', marginBottom:8 }}>Brand style preset</label>
              <Select value="Alconic (Default)" options={['Alconic (Default)','Minimal','Bold','Corporate']} onChange={()=>{}} />
            </div>
            <SaveBtn onClick={save} />
          </div>
        )}

        {section==='Defaults' && (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <h2 style={{ fontSize:20, fontWeight:700 }}>Defaults</h2>
            <div>
              <label style={{ fontSize:13, color:T.textMuted, display:'block', marginBottom:8 }}>Default video model</label>
              <Select value={defModel} options={['Seedance 2.5','Seedance 1','Wan I2V 2.1']} onChange={setDefModel} />
            </div>
            <div>
              <label style={{ fontSize:13, color:T.textMuted, display:'block', marginBottom:8 }}>Default resolution</label>
              <Select value={defRes} options={['720p (HD)','1080p (Full HD)','4K (Ultra HD)']} onChange={setDefRes} />
            </div>
            <div>
              <label style={{ fontSize:13, color:T.textMuted, display:'block', marginBottom:8 }}>Default aspect ratio</label>
              <Select value={defRatio} options={['16:9','9:16','1:1','4:3']} onChange={setDefRatio} />
            </div>
            <div>
              <label style={{ fontSize:13, color:T.textMuted, display:'block', marginBottom:8 }}>Default style</label>
              <Select value={defStyle} options={['Cinematic','3D Render','Anime','Realistic','Abstract']} onChange={setDefStyle} />
            </div>
            <SaveBtn onClick={save} />
          </div>
        )}

        {section==='Notifications' && (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <h2 style={{ fontSize:20, fontWeight:700 }}>Notifications</h2>
            {[['Render complete','Email + Push'],['Low balance','Email'],['Team invite','Email + Push'],['Product updates','Email']].map(([ev,ch])=>(
              <div key={ev} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderBottom:`1px solid ${T.borderFaint}` }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:500 }}>{ev}</div>
                  <div style={{ fontSize:12, color:T.textMuted, marginTop:2 }}>{ch}</div>
                </div>
                <div style={{ width:44, height:24, borderRadius:12, background:T.violet, cursor:'pointer', position:'relative' }}>
                  <div style={{ position:'absolute', right:3, top:3, width:18, height:18, borderRadius:'50%', background:T.bg }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {section==='API keys' && (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <h2 style={{ fontSize:20, fontWeight:700 }}>API keys</h2>
            <p style={{ fontSize:13, color:T.textMuted, lineHeight:1.6 }}>Use these keys to integrate Alconic Motion into your own applications. Keep them secret — don't share or commit to version control.</p>
            <div style={{ padding:'14px 16px', borderRadius:12, background:T.panelDark, border:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, color:T.textMuted, marginBottom:4 }}>Production key</div>
                <div style={{ fontFamily:T.mono, fontSize:13, letterSpacing:'.05em' }}>
                  {apiVisible ? 'am_prod_sk_3rTx9wZpMqK2nBvL8hYcFjAe' : 'am_prod_sk_•••••••••••••••••••••'}
                </div>
              </div>
              <button onClick={()=>setApiVisible(v=>!v)} style={{ height:30, padding:'0 12px', borderRadius:7, border:`1px solid ${T.border}`, background:'transparent', color:T.textMuted, font:`500 12px ${T.sans}`, cursor:'pointer' }}>{apiVisible?'Hide':'Reveal'}</button>
              <button style={{ height:30, padding:'0 12px', borderRadius:7, border:`1px solid ${T.border}`, background:'transparent', color:T.textMuted, font:`500 12px ${T.sans}`, cursor:'pointer' }}>Copy</button>
            </div>
            <button style={{ alignSelf:'flex-start', height:36, padding:'0 16px', borderRadius:9, border:`1px solid ${T.border}`, background:'transparent', color:T.textMid, font:`500 13px ${T.sans}`, cursor:'pointer' }}>+ Generate new key</button>
          </div>
        )}

        {section==='Team' && (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <h2 style={{ fontSize:20, fontWeight:700 }}>Team</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {MEMBERS.map(m => (
                <div key={m.email} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:12, background:T.panelDark, border:`1px solid ${T.border}` }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:'oklch(0.3 0.05 295)', display:'grid', placeItems:'center', fontSize:13, fontWeight:600 }}>{m.avatar}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:500 }}>{m.name}</div>
                    <div style={{ fontSize:12, color:T.textMuted }}>{m.email}</div>
                  </div>
                  <Select value={m.role} options={['Owner','Editor','Viewer']} onChange={()=>{}} small />
                </div>
              ))}
            </div>
            <div>
              <label style={{ fontSize:13, color:T.textMuted, display:'block', marginBottom:8 }}>Invite by email</label>
              <div style={{ display:'flex', gap:8 }}>
                <input value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)} placeholder="colleague@company.com" style={{ flex:1, height:38, padding:'0 12px', borderRadius:9, border:`1px solid ${T.borderLight}`, background:T.panelDark, color:T.text, fontSize:13, outline:'none' }} />
                <button style={{ height:38, padding:'0 16px', borderRadius:9, border:0, background:T.violet, color:T.bg, font:`600 13px ${T.sans}`, cursor:'pointer' }}>Invite</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, disabled }: { label:string; value:string; onChange?:(v:string)=>void; disabled?:boolean }) {
  return (
    <div>
      <label style={{ fontSize:13, color:T.textMuted, display:'block', marginBottom:6 }}>{label}</label>
      <input value={value} onChange={e=>onChange?.(e.target.value)} disabled={disabled}
        style={{ width:'100%', height:38, padding:'0 12px', borderRadius:9, border:`1px solid ${T.borderLight}`, background:disabled?'oklch(0.16 0.02 285)':T.panelDark, color:disabled?T.textMuted:T.text, fontSize:13, outline:'none', cursor:disabled?'not-allowed':'text' }} />
    </div>
  );
}

function Select({ value, options, onChange, small=false }: { value:string; options:string[]; onChange:(v:string)=>void; small?:boolean }) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)} style={{ height:small?30:38, padding:`0 ${small?8:12}px`, borderRadius:small?7:9, border:`1px solid ${T.borderLight}`, background:T.panelDark, color:T.text, fontSize:small?12:13, outline:'none', cursor:'pointer', width:small?'auto':'100%' }}>
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function SaveBtn({ onClick }: { onClick:()=>void }) {
  return (
    <button onClick={onClick} style={{ alignSelf:'flex-start', height:38, padding:'0 20px', borderRadius:9, border:0, background:T.violet, color:T.bg, font:`600 14px ${T.sans}`, cursor:'pointer' }}>Save changes</button>
  );
}
