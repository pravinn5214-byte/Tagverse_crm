'use client';
import { useState } from 'react';

const pipeline = [
  {
    id: 'new', label: 'New Enquiry', color: 'new', headerColor: '#3b82f6',
    deals: [
      { id: 1, name: 'Riya Sharma', company: 'BloomAds', value: 45000, owner: 'JS', days: 0, source: 'Meta Ads' },
      { id: 2, name: 'Karthik R.', company: 'TechVibe', value: 80000, owner: 'AM', days: 1, source: 'Form' },
      { id: 3, name: 'Meera N.', company: 'FreshBrand', value: 30000, owner: 'JS', days: 0, source: 'Referral' },
    ],
  },
  {
    id: 'engaged', label: 'Engaged', color: 'engaged', headerColor: '#7c5cbf',
    deals: [
      { id: 4, name: 'Arjun Mehta', company: 'GrowthLab', value: 120000, owner: 'SA', days: 3, source: 'Form' },
      { id: 5, name: 'Priya K.', company: 'NexaDigital', value: 60000, owner: 'JS', days: 2, source: 'Referral' },
    ],
  },
  {
    id: 'qualified', label: 'Qualified', color: 'qualified', headerColor: '#f59e0b',
    deals: [
      { id: 6, name: 'Sameer P.', company: 'MediaCo', value: 95000, owner: 'AM', days: 5, source: 'LinkedIn' },
      { id: 7, name: 'Divya T.', company: 'BrandNest', value: 210000, owner: 'SA', days: 4, source: 'Meta Ads' },
    ],
  },
  {
    id: 'proposal', label: 'Proposal Sent', color: 'proposal', headerColor: '#6366f1',
    deals: [
      { id: 8, name: 'Raj Verma', company: 'ScaleUp', value: 180000, owner: 'JS', days: 7, source: 'LinkedIn' },
    ],
  },
  {
    id: 'negotiation', label: 'Negotiation', color: 'negotiation', headerColor: '#f97316',
    deals: [
      { id: 9, name: 'Ananya S.', company: 'ClickFarm', value: 350000, owner: 'AM', days: 12, source: 'Cold Email' },
      { id: 10, name: 'Vikram L.', company: 'AdSphere', value: 280000, owner: 'JS', days: 10, source: 'Referral' },
    ],
  },
  {
    id: 'won', label: 'Closed Win', color: 'won', headerColor: '#10b981',
    deals: [
      { id: 11, name: 'Nisha D.', company: 'BoldMark', value: 420000, owner: 'SA', days: 18, source: 'Meta Ads' },
    ],
  },
  {
    id: 'lost', label: 'Closed Lose', color: 'lost', headerColor: '#f43f5e',
    deals: [
      { id: 12, name: 'Mohit B.', company: 'SprintCo', value: 70000, owner: 'AM', days: 21, source: 'Cold Email' },
    ],
  },
];

function fmtVal(v: number) {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  return `₹${(v / 1000).toFixed(0)}K`;
}

export default function PipelinePage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');

  const totalValue = pipeline.flatMap(s => s.deals).reduce((a, d) => a + d.value, 0);
  const wonValue = (pipeline.find(s => s.id === 'won')?.deals || []).reduce((a, d) => a + d.value, 0);
  const totalDeals = pipeline.flatMap(s => s.deals).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Pipeline Value', value: fmtVal(totalValue), color: 'purple' },
          { label: 'Closed Won (Month)', value: fmtVal(wonValue), color: 'emerald' },
          { label: 'Active Deals', value: String(totalDeals - 2), color: 'blue' },
          { label: 'Avg. Deal Size', value: fmtVal(Math.round(totalValue / totalDeals)), color: 'amber' },
        ].map(k => (
          <div key={k.label} className={`kpi-card ${k.color}`}>
            <div className="kpi-label" style={{ marginBottom: 8 }}>{k.label}</div>
            <div className="kpi-value">{k.value}</div>
          </div>
        ))}
      </div>

      {/* View toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          {(['kanban', 'list'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: '7px 16px', fontSize: 12, fontWeight: 600, background: view === v ? 'var(--purple-dim)' : 'transparent', color: view === v ? 'var(--purple-light)' : 'var(--text-muted)', border: 'none', cursor: 'pointer', borderRight: '1px solid var(--border)', fontFamily: 'Inter, sans-serif', textTransform: 'capitalize' }}>
              {v === 'kanban' ? '⬡ Kanban' : '≡ List'}
            </button>
          ))}
        </div>
        <button className="btn btn-primary">+ New Deal</button>
      </div>

      {/* Kanban Board */}
      {view === 'kanban' && (
        <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
          <div style={{ display: 'flex', gap: 12, minWidth: 'max-content' }}>
            {pipeline.map(col => (
              <div key={col.id} style={{ width: 220, flexShrink: 0 }}>
                {/* Column Header */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderTop: `3px solid ${col.headerColor}`, borderRadius: '10px 10px 0 0', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{col.label}</span>
                  <span className={`pipeline-col-count ${col.color}`} style={{ background: `${col.headerColor}22`, color: col.headerColor, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 8 }}>{col.deals.length}</span>
                </div>
                {/* Deals */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '8px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 120 }}>
                  {col.deals.map(deal => (
                    <div key={deal.id} className="deal-card">
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{deal.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>{deal.company}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--emerald-light)' }}>{fmtVal(deal.value)}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 10, color: deal.days > 10 ? 'var(--rose-light)' : 'var(--text-muted)' }}>{deal.days}d</span>
                          <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, var(--purple), var(--blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: 'white' }}>{deal.owner}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button style={{ border: '1px dashed var(--border)', borderRadius: 8, padding: '8px', fontSize: 11, color: 'var(--text-muted)', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>+ Add Deal</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>
                <th>Deal</th>
                <th>Company</th>
                <th>Value</th>
                <th>Stage</th>
                <th>Source</th>
                <th>Age</th>
                <th>Owner</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pipeline.flatMap(col => col.deals.map(deal => (
                <tr key={deal.id} style={{ cursor: 'pointer' }}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{deal.name}</td>
                  <td>{deal.company}</td>
                  <td style={{ fontWeight: 700, color: 'var(--emerald-light)' }}>{fmtVal(deal.value)}</td>
                  <td><span className={`badge ${col.color}`}>{col.label}</span></td>
                  <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{deal.source}</td>
                  <td style={{ color: deal.days > 10 ? 'var(--rose-light)' : 'var(--text-muted)', fontSize: 12 }}>{deal.days}d</td>
                  <td><div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, var(--purple), var(--blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'white' }}>{deal.owner}</div></td>
                  <td><button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }}>Open →</button></td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
