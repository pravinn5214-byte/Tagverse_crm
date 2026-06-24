'use client';

export default function CampaignsPage() {
  const kpis = [
    { label: 'Active campaigns', value: '6', delta: '+2 this month', trend: 'up', color: 'purple' },
    { label: 'Total reach', value: '48K', delta: 'Across all channels', trend: 'up', color: 'blue' },
    { label: 'Avg. open rate', value: '28.4%', delta: '+3.1% vs last mo.', trend: 'up', color: 'emerald' },
    { label: 'Conversions', value: '312', delta: '+22% this month', trend: 'up', color: 'amber' },
  ];

  const campaignsList = [
    { name: 'Q3 product launch', channel: 'Email', budget: '₹80K', spent: '₹52K', dates: 'Jun 1 – Jul 15', status: 'Active', badgeChannel: 'purple', badgeStatus: 'emerald' },
    { name: 'Referral drive — June', channel: 'Social', budget: '₹30K', spent: '₹12K', dates: 'Jun 10 – Jun 30', status: 'Active', badgeChannel: 'blue', badgeStatus: 'emerald' },
    { name: 'Re-engagement blast', channel: 'Email', budget: '₹15K', spent: '—', dates: 'Jul 1 – Jul 10', status: 'Draft', badgeChannel: 'purple', badgeStatus: 'amber' },
    { name: 'Google Ads — brand', channel: 'Paid', budget: '₹1.2L', spent: '₹1.2L', dates: 'May 1 – May 31', status: 'Done', badgeChannel: 'rose', badgeStatus: 'rose' },
    { name: 'Webinar promo', channel: 'Social', budget: '₹20K', spent: '₹8K', dates: 'Jun 20 – Jul 5', status: 'Paused', badgeChannel: 'blue', badgeStatus: 'amber' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="section-title" style={{ fontSize: 20 }}>Campaigns</div>
          <div className="section-sub" style={{ fontSize: 13 }}>Plan, run, and track marketing campaigns</div>
        </div>
        <button className="btn btn-primary">+ New campaign</button>
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

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Search campaigns..." 
          style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} 
        />
        <select style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}>
          <option>All statuses</option>
          <option>Active</option>
          <option>Draft</option>
          <option>Completed</option>
          <option>Paused</option>
        </select>
        <select style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}>
          <option>All channels</option>
          <option>Email</option>
          <option>Social</option>
          <option>Paid</option>
        </select>
      </div>

      {/* Table */}
      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: '28%' }}>Campaign</th>
              <th style={{ width: '12%' }}>Channel</th>
              <th style={{ width: '10%' }}>Budget</th>
              <th style={{ width: '10%' }}>Spent</th>
              <th style={{ width: '14%' }}>Dates</th>
              <th style={{ width: '12%' }}>Status</th>
              <th style={{ width: '14%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaignsList.map((c, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.name}</td>
                <td><span className={`badge ${c.badgeChannel}`}>{c.channel}</span></td>
                <td style={{ fontWeight: 600 }}>{c.budget}</td>
                <td>{c.spent}</td>
                <td>{c.dates}</td>
                <td><span className={`badge ${c.badgeStatus}`}>{c.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }}>Stats</button>
                    <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }}>Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
