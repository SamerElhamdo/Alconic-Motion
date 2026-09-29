import { useState } from 'react';
import { T } from '../tokens';

const TXN = [
  { date:'Sep 29', desc:'Cinematic whale video',   type:'used',  amt:-98  },
  { date:'Sep 28', desc:'Product launch reel',     type:'used',  amt:-130 },
  { date:'Sep 27', desc:'Top-up · 1,000 cr pack',  type:'topup', amt:+1000 },
  { date:'Sep 25', desc:'Brand ident v3',           type:'used',  amt:-45  },
  { date:'Sep 24', desc:'Explainer draft',          type:'used',  amt:-180 },
  { date:'Sep 22', desc:'Top-up · 500 cr pack',    type:'topup', amt:+500  },
];

const USAGE = [45,78,120,55,180,98,130,45,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,98];
const maxU = Math.max(...USAGE);

const PLANS = [
  { id:'free',   name:'Free',   price:'$0/mo',  credits:200,  features:['200 credits/month','720p max','Community models','—'] },
  { id:'pro',    name:'Pro',    price:'$29/mo', credits:3000, features:['3,000 credits/month','1080p max','All models','Priority queue'] },
  { id:'studio', name:'Studio', price:'$99/mo', credits:12000,features:['12,000 credits/month','4K max','All models + Lumina','Dedicated queue'] },
];

const TOPUPS = [
  { cr:500,  price:'$9' },
  { cr:1000, price:'$16' },
  { cr:2500, price:'$35' },
  { cr:5000, price:'$60' },
];

export default function Billing() {
  const [plan, setPlan] = useState('pro');
  const [paySuccess, setPaySuccess] = useState<number|null>(null);

  const balance = 1240;
  const used30 = USAGE.reduce((a,b)=>a+b,0);
  const low = balance < 300;

  return (
    <div style={{ flex:1, minHeight:0, overflow:'auto' }}>
      <div style={{ maxWidth:960, margin:'0 auto', padding:'28px 24px', display:'flex', flexDirection:'column', gap:32 }}>

        {/* Balance card */}
        {low && (
          <div style={{ padding:'12px 16px', borderRadius:12, background:'oklch(0.28 0.05 50 / .25)', border:`1px solid oklch(0.55 0.1 50 / .5)`, display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ fontSize:20 }}>⚠</span>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:'oklch(0.88 0.1 55)' }}>Low balance</div>
              <div style={{ fontSize:13, color:'oklch(0.75 0.08 55)' }}>You have {balance} credits left. Top up to keep creating without interruption.</div>
            </div>
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:16 }}>
          {/* Balance */}
          <div style={{ borderRadius:16, background:T.panel, border:`1px solid ${T.border}`, padding:24, display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ fontSize:14, color:T.textMuted }}>Current balance</div>
            <div style={{ fontSize:44, fontWeight:700, letterSpacing:'-.03em', color:low?'oklch(0.75 0.14 50)':T.mint }}>{balance.toLocaleString()}</div>
            <div style={{ fontSize:14, color:T.textMuted }}>credits</div>
            <div style={{ height:1, background:T.border }} />
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
              <span style={{ color:T.textMuted }}>Used this month</span>
              <span style={{ fontFamily:T.mono, fontWeight:600 }}>{used30.toLocaleString()} cr</span>
            </div>
          </div>

          {/* Bar chart */}
          <div style={{ borderRadius:16, background:T.panel, border:`1px solid ${T.border}`, padding:24 }}>
            <div style={{ fontSize:14, fontWeight:600, marginBottom:16 }}>Last 30 days usage</div>
            <div style={{ display:'flex', alignItems:'flex-end', gap:4, height:80 }}>
              {USAGE.map((u,i) => (
                <div key={i} style={{ flex:1, borderRadius:'3px 3px 0 0', background:u>0?T.violet:'oklch(0.24 0.03 285)', height:`${maxU>0?(u/maxU*100):0}%`, minHeight:u>0?2:0 }} />
              ))}
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, fontFamily:T.mono, fontSize:11, color:T.textFaint }}>
              <span>Sep 1</span><span>Sep 15</span><span>Sep 29</span>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div>
          <h2 style={{ fontSize:18, fontWeight:600, marginBottom:16 }}>Plans</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {PLANS.map(p => (
              <div key={p.id} style={{ borderRadius:16, background:T.panel, border:`1px solid ${p.id===plan?T.violetDim:T.border}`, padding:24, display:'flex', flexDirection:'column', gap:16 }}>
                <div>
                  <div style={{ fontSize:16, fontWeight:700 }}>{p.name}</div>
                  <div style={{ fontSize:28, fontWeight:700, marginTop:4 }}>{p.price}</div>
                  <div style={{ fontSize:13, color:T.textMuted, marginTop:2 }}>{p.credits.toLocaleString()} credits/month</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:f==='—'?T.textFaint:T.textMid }}>
                      <span style={{ color:f==='—'?T.textFaint:T.mint }}>{f==='—'?'–':'✓'}</span>{f}
                    </div>
                  ))}
                </div>
                <button onClick={()=>setPlan(p.id)} style={{ height:38, borderRadius:9, border:`1px solid ${p.id===plan?T.violetDim:T.border}`, background:p.id===plan?T.violet:'transparent', color:p.id===plan?T.bg:T.textMid, font:`600 13px ${T.sans}`, cursor:'pointer' }}>
                  {p.id===plan?'Current plan':'Switch to '+p.name}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Top-up */}
        <div>
          <h2 style={{ fontSize:18, fontWeight:600, marginBottom:16 }}>Top-up credits</h2>
          {paySuccess && (
            <div style={{ marginBottom:16, padding:'12px 16px', borderRadius:12, background:T.mintBg, border:`1px solid oklch(0.5 0.12 170 / .5)`, color:T.mint, fontSize:14, fontWeight:600 }}>
              ✓ Payment successful — {paySuccess.toLocaleString()} credits added
            </div>
          )}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
            {TOPUPS.map(t => (
              <div key={t.cr} onClick={()=>setPaySuccess(t.cr)} style={{ borderRadius:14, background:T.panel, border:`1px solid ${T.border}`, padding:'20px 16px', textAlign:'center', cursor:'pointer' }}>
                <div style={{ fontFamily:T.mono, fontSize:28, fontWeight:700, color:T.violet }}>{(t.cr/1000).toFixed(t.cr<1000?0:1)}k</div>
                <div style={{ fontSize:14, color:T.textMuted, marginTop:2 }}>credits</div>
                <div style={{ fontSize:22, fontWeight:700, marginTop:12 }}>{t.price}</div>
                <button style={{ marginTop:12, height:36, width:'100%', borderRadius:9, border:0, background:T.violet, color:T.bg, font:`600 13px ${T.sans}`, cursor:'pointer' }}>Buy</button>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions */}
        <div>
          <h2 style={{ fontSize:18, fontWeight:600, marginBottom:16 }}>Transactions</h2>
          <div style={{ borderRadius:14, background:T.panel, border:`1px solid ${T.border}`, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ background:T.panelDark }}>
                  {['Date','Description','Type','Credits'].map(h => (
                    <th key={h} style={{ padding:'11px 16px', textAlign:'left', color:T.textMuted, fontWeight:500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TXN.map((tx,i) => (
                  <tr key={i} style={{ borderTop:`1px solid ${T.borderFaint}` }}>
                    <td style={{ padding:'10px 16px', fontFamily:T.mono, fontSize:12, color:T.textMuted }}>{tx.date}</td>
                    <td style={{ padding:'10px 16px' }}>{tx.desc}</td>
                    <td style={{ padding:'10px 16px' }}>
                      <span style={{ padding:'2px 8px', borderRadius:5, fontSize:11, background:tx.type==='topup'?T.mintBg:'oklch(0.25 0.03 285)', color:tx.type==='topup'?T.mint:T.textMuted }}>{tx.type}</span>
                    </td>
                    <td style={{ padding:'10px 16px', fontFamily:T.mono, fontWeight:600, color:tx.amt>0?T.mint:T.textMid }}>
                      {tx.amt>0?'+':''}{tx.amt} cr
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
