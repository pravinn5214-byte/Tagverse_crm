'use client';
import { useState } from 'react';

const leads = [
  { id: 1, name: 'Riya Sharma', company: 'BloomAds', phone: '+91 98765 43210', email: 'riya@bloomads.in', source: 'Meta Ads', stage: 'new', score: 82, owner: 'JS', whatsapp: true, created: '2m ago', intent: 'SEO + Social' },
  { id: 2, name: 'Arjun Mehta', company: 'GrowthLab', phone: '+91 98112 33445', email: 'arjun@growthlab.io', source: 'Website Form', stage: 'engaged', score: 71, owner: 'SA', whatsapp: true, created: '28m ago', intent: 'Email Marketing' },
  { id: 3, name: 'Priya K.', company: 'NexaDigital', phone: '+91 97001 22334', email: 'priya@nexa.co', source: 'Referral', stage: 'engaged', score: 67, owner: 'JS', whatsapp: false, created: '1h ago', intent: 'Full CRM' },
  { id: 4, name: 'Sameer P.', company: 'MediaCo', phone: '+91 96543 11222', email: 'sameer@mediaco.in', source: 'LinkedIn', stage: 'qualified', score: 88, owner: 'AM', whatsapp: true, created: '3h ago', intent: 'Social Media' },
  { id: 5, name: 'Divya T.', company: 'BrandNest', phone: '+91 95432 10111', email: 'divya@brandnest.com', source: 'Meta Ads', stage: 'qualified', score: 91, owner: 'SA', whatsapp: true, created: '5h ago', intent: 'SEO + Content' },
  { id: 6, name: 'Raj Verma', company: 'ScaleUp', phone: '+91 94321 09000', email: 'raj@scaleup.in', source: 'LinkedIn DM', stage: 'proposal', score: 94, owner: 'JS', whatsapp: true, created: '1d ago', intent: 'Full CRM + Revenue' },
  { id: 7, name: 'Ananya S.', company: 'ClickFarm', phone: '+91 93210 08999', email: 'ananya@clickfarm.io', source: 'Cold Email', stage: 'negotiation', score: 78, owner: 'AM', whatsapp: false, created: '2d ago', intent: 'Analytics' },
  { id: 8, name: 'Vikram L.', company: 'AdSphere', phone: '+91 92109 07888', email: 'vikram@adsphere.com', source: 'Referral', stage: 'negotiation', score: 85, owner: 'JS', whatsapp: true, created: '2d ago', intent: 'Email + Social' },
  { id: 9, name: 'Nisha D.', company: 'BoldMark', phone: '+91 91098 06777', email: 'nisha@boldmark.in', source: 'Meta Ads', stage: 'won', score: 97, owner: 'SA', whatsapp: true, created: '5d ago', intent: 'Full Suite' },
  { id: 10, name: 'Mohit B.', company: 'SprintCo', phone: '+91 90987 05666', email: 'mohit@sprintco.io', source: 'Cold Email', stage: 'lost', score: 40, owner: 'AM', whatsapp: false, created: '7d ago', intent: 'SEO' },
];

const stageFilters = ['all', 'new', 'engaged', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];

export default function LeadsPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = leads.filter(l =>
    (filter === 'all' || l.stage === filter) &&
    (l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Contacts', value: '1,284', color: 'blue' },
          { label: 'New This Week', value: '48', color: 'purple' },
          { label: 'Hot Leads (Score ≥ 80)', value: '212', color: 'amber' },
          { label: 'Avg. Lead Score', value: '73.4', color: 'emerald' },
        ].map(s => (
          <div key={s.label} className={`kpi-card ${s.color}`}>
            <div className="kpi-label" style={{ marginBottom: 8 }}>{s.label}</div>
            <div className="kpi-value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text-muted)' }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or company..."
            style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px 8px 36px', color: 'var(--text-primary)', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif' }}
          />
        </div>
        <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          {stageFilters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 12px', fontSize: 11, fontWeight: 600, background: filter === f ? 'var(--purple-dim)' : 'transparent', color: filter === f ? 'var(--purple-light)' : 'var(--text-muted)', border: 'none', cursor: 'pointer', textTransform: 'capitalize', borderRight: '1px solid var(--border)', fontFamily: 'Inter, sans-serif' }}>
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
        <button className="btn btn-primary">+ Import CSV</button>
      </div>

      {/* Leads Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Contact</th>
                <th>Phone / Email</th>
                <th>Source</th>
                <th>Intent</th>
                <th>Stage</th>
                <th>Score</th>
                <th>WA</th>
                <th>Owner</th>
                <th>Added</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id} style={{ cursor: 'pointer' }}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{l.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l.company}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12 }}>{l.phone}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l.email}</div>
                  </td>
                  <td><span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 6 }}>{l.source}</span></td>
                  <td style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{l.intent}</td>
                  <td><span className={`badge ${l.stage}`}>{l.stage === 'won' ? '✓ Won' : l.stage === 'lost' ? '✗ Lost' : l.stage}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${l.score}%`, height: '100%', background: l.score >= 80 ? 'var(--emerald)' : l.score >= 60 ? 'var(--amber)' : 'var(--rose)', borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: l.score >= 80 ? 'var(--emerald-light)' : l.score >= 60 ? 'var(--amber-light)' : 'var(--rose-light)' }}>{l.score}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 16 }}>{l.whatsapp ? '🟢' : '⚫'}</td>
                  <td><div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, var(--purple), var(--blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'white' }}>{l.owner}</div></td>
                  <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l.created}</td>
                  <td>
                    <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }}>View →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
