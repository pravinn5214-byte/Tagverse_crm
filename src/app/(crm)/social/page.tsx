'use client';

export default function SocialMediaPage() {
  const kpis = [
    { label: 'Total followers', value: '24.6K', delta: '+480 this month', trend: 'up', color: 'purple' },
    { label: 'Posts this month', value: '38', delta: 'Across 3 channels', trend: 'up', color: 'blue' },
    { label: 'Avg. engagement', value: '5.8%', delta: '+1.2% vs last mo.', trend: 'up', color: 'emerald' },
    { label: 'Pending approval', value: '5', delta: 'Needs review', trend: 'down', color: 'rose' },
  ];

  const platforms = [
    { 
      name: 'LinkedIn', handle: '@YourBrand', followers: '11.2K', icon: 'in', colorBg: 'var(--blue-dim)', colorText: 'var(--blue-light)', 
      growth: '68%', barColor: 'var(--blue)', metrics: [{v: '6.1%', l: 'Eng. rate'}, {v: '18', l: 'Posts'}, {v: '4.2K', l: 'Impressions'}]
    },
    { 
      name: 'Instagram', handle: '@YourBrand', followers: '9.4K', icon: 'ig', colorBg: 'var(--rose-dim)', colorText: 'var(--rose-light)', 
      growth: '52%', barColor: 'var(--rose)', metrics: [{v: '7.3%', l: 'Eng. rate'}, {v: '14', l: 'Posts'}, {v: '3.8K', l: 'Impressions'}]
    },
    { 
      name: 'Twitter / X', handle: '@YourBrand', followers: '4.0K', icon: '𝕏', colorBg: 'var(--emerald-dim)', colorText: 'var(--emerald-light)', 
      growth: '28%', barColor: 'var(--emerald)', metrics: [{v: '3.2%', l: 'Eng. rate'}, {v: '6', l: 'Posts'}, {v: '1.1K', l: 'Impressions'}]
    },
  ];

  const pendingApproval = [
    { platform: 'LinkedIn', colorText: 'var(--blue-light)', text: 'Excited to share our latest case study on how Arka Systems improved retention by 42% using our platform...' },
    { platform: 'Instagram', colorText: 'var(--rose-light)', text: "🚀 Big things are coming this July. Stay tuned for our Q3 product launch — you won't want to miss it." },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="section-title" style={{ fontSize: 20 }}>Social Media Manager</div>
          <div className="section-sub" style={{ fontSize: 13 }}>Posts, engagement, and channel performance</div>
        </div>
        <button className="btn btn-primary">+ New post</button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {kpis.map((k) => (
          <div key={k.label} className={`kpi-card ${k.color}`}>
            <div className="kpi-header">
              <span className="kpi-label">{k.label}</span>
            </div>
            <div className="kpi-value">{k.value}</div>
            <div className={`kpi-delta ${k.trend}`}>{k.trend === 'up' ? '↑' : '↓'} {k.delta}</div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Platforms Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {platforms.map((p, i) => (
            <div key={i} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: p.colorBg, color: p.colorText, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 }}>
                  {p.icon}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.handle} • {p.followers} followers</div>
                </div>
              </div>
              
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Follower growth</div>
              <div style={{ height: 6, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ height: '100%', width: p.growth, background: p.barColor, borderRadius: 4 }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, textAlign: 'center' }}>
                {p.metrics.map((m, j) => (
                  <div key={j}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{m.v}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{m.l}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pending Approval Column */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Pending approval</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pendingApproval.map((p, i) => (
              <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 14, background: 'var(--bg-card)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: p.colorText }}>●</span> {p.platform}
                  </span>
                  <span className="badge amber">Pending</span>
                </div>
                <div style={{ background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 6, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
                  {p.text}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button className="btn btn-ghost" style={{ color: 'var(--rose-light)' }}>✕ Reject</button>
                  <button className="btn btn-ghost" style={{ color: 'var(--emerald-light)', borderColor: 'var(--emerald-dim)' }}>✓ Approve</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
