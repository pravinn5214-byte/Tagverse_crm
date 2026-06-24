'use client';
import { useState, useMemo } from 'react';

type Contract = {
  id: string; client: string; valuePerYear: number; start: string;
  end: string; progress: number; status: 'Active' | 'Pending Signature' | 'Expiring' | 'Terminated';
};

const INITIAL_CONTRACTS: Contract[] = [
  { id: '#CTR-055', client: 'Arka Systems', valuePerYear: 480000, start: 'Jan 1 2025', end: 'Dec 31 2025', progress: 48, status: 'Active' },
  { id: '#CTR-054', client: 'Nexus Retail', valuePerYear: 240000, start: 'Mar 1 2025', end: 'Feb 28 2026', progress: 30, status: 'Pending Signature' },
  { id: '#CTR-053', client: 'Indra Logistics', valuePerYear: 960000, start: 'Jul 1 2024', end: 'Jun 30 2025', progress: 91, status: 'Expiring' },
  { id: '#CTR-052', client: 'Vega Partners', valuePerYear: 180000, start: 'Feb 1 2025', end: 'Jan 31 2026', progress: 35, status: 'Active' },
  { id: '#CTR-051', client: 'BlueStar Media', valuePerYear: 120000, start: 'Apr 1 2025', end: 'Mar 31 2026', progress: 20, status: 'Active' },
];

function fmt(v: number) {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  return `₹${v.toLocaleString('en-IN')}`;
}

const STATUS_BADGE: Record<string, string> = {
  Active: 'badge emerald',
  'Pending Signature': 'badge amber',
  Expiring: 'badge rose',
  Terminated: 'badge',
};

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mClient, setMClient] = useState('');
  const [mValue, setMValue] = useState('');
  const [mStart, setMStart] = useState('');
  const [mEnd, setMEnd] = useState('');
  const [mStatus, setMStatus] = useState<Contract['status']>('Active');

  const filtered = useMemo(() => contracts.filter(c => {
    const ms = c.client.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    return ms && (filterStatus === 'All' || c.status === filterStatus);
  }), [contracts, search, filterStatus]);

  const totalARR = contracts.filter(c => c.status === 'Active').reduce((a, c) => a + c.valuePerYear, 0);
  const expiring = contracts.filter(c => c.status === 'Expiring').length;
  const pendingSig = contracts.filter(c => c.status === 'Pending Signature').length;
  const active = contracts.filter(c => c.status === 'Active').length;

  const openNew = () => { setMClient(''); setMValue(''); setMStart(''); setMEnd(''); setMStatus('Active'); setEditingId(null); setIsModalOpen(true); };
  const openEdit = (c: Contract) => { setMClient(c.client); setMValue(String(c.valuePerYear)); setMStart(c.start); setMEnd(c.end); setMStatus(c.status); setEditingId(c.id); setIsModalOpen(true); };
  const handleSave = () => {
    if (!mClient.trim()) return;
    if (editingId) {
      setContracts(p => p.map(c => c.id === editingId ? { ...c, client: mClient, valuePerYear: Number(mValue), start: mStart, end: mEnd, status: mStatus } : c));
    } else {
      setContracts(p => [{
        id: `#CTR-${Math.floor(56 + Math.random() * 100)}`, client: mClient,
        valuePerYear: Number(mValue) || 0, start: mStart, end: mEnd, progress: 0, status: mStatus
      }, ...p]);
    }
    setIsModalOpen(false);
  };
  const handleDelete = (id: string) => { setContracts(p => p.filter(c => c.id !== id)); setIsModalOpen(false); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="section-title" style={{ fontSize: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-writing-sign" style={{ color: 'var(--purple)', fontSize: 24 }}></i> Contracts
          </div>
          <div className="section-sub" style={{ fontSize: 13, marginTop: 4 }}>Active agreements, renewal pipeline, and ARR tracking.</div>
        </div>
        <button className="btn btn-primary" onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="ti ti-plus"></i> New Contract
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Active Contracts', value: String(active), delta: '↑ 2 this month', color: 'emerald' },
          { label: 'Expiring in 30d', value: String(expiring), delta: 'Renewal needed', color: 'rose', neg: true },
          { label: 'Awaiting Signature', value: String(pendingSig), delta: 'Sent for review', color: 'amber' },
          { label: 'Total ARR', value: fmt(totalARR), delta: '↑ 15% YoY', color: 'purple' },
        ].map(k => (
          <div key={k.label} className={`kpi-card ${k.color}`}>
            <div className="kpi-label" style={{ marginBottom: 6 }}>{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div style={{ fontSize: 12, color: k.neg ? 'var(--rose-light)' : 'var(--emerald-light)', marginTop: 4 }}>{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-muted)' }}></i>
          <input type="text" placeholder="Search contracts…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}>
          {['All', 'Active', 'Pending Signature', 'Expiring', 'Terminated'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card table-wrap" style={{ padding: 0, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th>Contract</th><th>Client</th><th>Value / yr</th><th>Start</th><th>End</th><th style={{ minWidth: 120 }}>Progress</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => openEdit(c)}>
                <td><span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{c.id}</span></td>
                <td style={{ fontWeight: 500 }}>{c.client}</td>
                <td style={{ fontWeight: 700, color: 'var(--emerald-light)', fontVariantNumeric: 'tabular-nums' }}>{fmt(c.valuePerYear)}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{c.start}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{c.end}</td>
                <td>
                  <div style={{ fontSize: 11, color: c.progress > 80 ? 'var(--rose-light)' : 'var(--text-secondary)', marginBottom: 4, fontWeight: 600 }}>{c.progress}%</div>
                  <div style={{ height: 5, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden', width: '100%' }}>
                    <div style={{ height: '100%', borderRadius: 4, width: `${c.progress}%`, background: c.progress > 80 ? 'var(--rose)' : 'var(--emerald)' }} />
                  </div>
                </td>
                <td><span className={STATUS_BADGE[c.status]}>{c.status}</span></td>
                <td onClick={e => e.stopPropagation()}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {c.status === 'Expiring' && (
                      <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <i className="ti ti-refresh"></i> Renew
                      </button>
                    )}
                    {c.status === 'Pending Signature' && (
                      <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <i className="ti ti-send"></i> Send
                      </button>
                    )}
                    <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => openEdit(c)}>
                      <i className="ti ti-eye"></i> View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No contracts match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: 480, padding: 24, background: 'var(--bg-secondary)', border: '1px solid var(--border-bright)', boxShadow: '0 12px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>{editingId ? 'Edit Contract' : 'New Contract'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Client</label>
                <input type="text" value={mClient} onChange={e => setMClient(e.target.value)} placeholder="e.g. Arka Systems"
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Value / Year (₹)</label>
                  <input type="number" value={mValue} onChange={e => setMValue(e.target.value)} placeholder="0"
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Status</label>
                  <select value={mStatus} onChange={e => setMStatus(e.target.value as Contract['status'])}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}>
                    {['Active', 'Pending Signature', 'Expiring', 'Terminated'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Start Date</label>
                  <input type="text" value={mStart} onChange={e => setMStart(e.target.value)} placeholder="e.g. Jan 1 2025"
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>End Date</label>
                  <input type="text" value={mEnd} onChange={e => setMEnd(e.target.value)} placeholder="e.g. Dec 31 2025"
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              {editingId ? <button className="btn btn-ghost" style={{ color: 'var(--rose)' }} onClick={() => handleDelete(editingId)}>Delete</button> : <div />}
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave}>{editingId ? 'Save Changes' : 'Create Contract'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
