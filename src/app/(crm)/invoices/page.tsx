'use client';
import { useState, useMemo } from 'react';

type Invoice = {
  id: string; client: string; amount: number; issued: string;
  due: string; status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
};

const INITIAL_INVOICES: Invoice[] = [
  { id: '#INV-2091', client: 'Nexus Retail', amount: 85000, issued: 'Jun 12', due: 'Jun 26', status: 'Sent' },
  { id: '#INV-2090', client: 'BlueStar Media', amount: 45500, issued: 'Jun 8', due: 'Jun 22', status: 'Overdue' },
  { id: '#INV-2089', client: 'Arka Systems', amount: 120000, issued: 'Jun 1', due: 'Jun 15', status: 'Paid' },
  { id: '#INV-2088', client: 'Vega Partners', amount: 60000, issued: 'May 25', due: 'Jun 8', status: 'Overdue' },
  { id: '#INV-2087', client: 'Indra Logistics', amount: 240000, issued: 'May 18', due: 'Jun 1', status: 'Paid' },
  { id: '#INV-2086', client: 'GrowthLab Inc.', amount: 35000, issued: 'May 10', due: 'May 24', status: 'Draft' },
];

function fmt(v: number) {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  return `₹${v.toLocaleString('en-IN')}`;
}

const STATUS_BADGE: Record<string, string> = {
  Draft: 'badge',
  Sent: 'badge amber',
  Paid: 'badge emerald',
  Overdue: 'badge rose',
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mClient, setMClient] = useState('');
  const [mAmount, setMAmount] = useState('');
  const [mStatus, setMStatus] = useState<Invoice['status']>('Draft');
  const [mDue, setMDue] = useState('');

  const filtered = useMemo(() => invoices.filter(inv => {
    const ms = inv.client.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase());
    return ms && (filterStatus === 'All' || inv.status === filterStatus);
  }), [invoices, search, filterStatus]);

  const totalInvoiced = invoices.reduce((a, i) => a + i.amount, 0);
  const outstanding = invoices.filter(i => i.status === 'Overdue' || i.status === 'Sent').reduce((a, i) => a + i.amount, 0);
  const paidThisMonth = invoices.filter(i => i.status === 'Paid').reduce((a, i) => a + i.amount, 0);
  const overdueCount = invoices.filter(i => i.status === 'Overdue').length;

  const openNew = () => { setMClient(''); setMAmount(''); setMStatus('Draft'); setMDue(''); setEditingId(null); setIsModalOpen(true); };
  const openEdit = (inv: Invoice) => { setMClient(inv.client); setMAmount(String(inv.amount)); setMStatus(inv.status); setMDue(inv.due); setEditingId(inv.id); setIsModalOpen(true); };
  const handleSave = () => {
    if (!mClient.trim()) return;
    if (editingId) {
      setInvoices(p => p.map(i => i.id === editingId ? { ...i, client: mClient, amount: Number(mAmount), status: mStatus, due: mDue } : i));
    } else {
      setInvoices(p => [{
        id: `#INV-${Math.floor(2000 + Math.random() * 999)}`, client: mClient,
        amount: Number(mAmount) || 0,
        issued: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        due: mDue, status: mStatus
      }, ...p]);
    }
    setIsModalOpen(false);
  };
  const handleDelete = (id: string) => { setInvoices(p => p.filter(i => i.id !== id)); setIsModalOpen(false); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="section-title" style={{ fontSize: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-file-invoice" style={{ color: 'var(--emerald)', fontSize: 24 }}></i> Invoices
          </div>
          <div className="section-sub" style={{ fontSize: 13, marginTop: 4 }}>Track billing, collections, and payment status.</div>
        </div>
        <button className="btn btn-primary" onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="ti ti-plus"></i> New Invoice
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Invoiced', value: fmt(totalInvoiced), delta: '↑ 8% vs last month', color: 'blue' },
          { label: 'Outstanding', value: fmt(outstanding), delta: `${overdueCount} overdue`, color: 'rose', neg: true },
          { label: 'Paid This Month', value: fmt(paidThisMonth), delta: '↑ 22% collected', color: 'emerald' },
          { label: 'Avg. Payment Time', value: '14d', delta: '↓ 3d faster', color: 'purple' },
        ].map(k => (
          <div key={k.label} className={`kpi-card ${k.color}`}>
            <div className="kpi-label" style={{ marginBottom: 6 }}>{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div style={{ fontSize: 12, color: k.neg ? 'var(--rose-light)' : 'var(--emerald-light)', marginTop: 4 }}>{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-muted)' }}></i>
          <input type="text" placeholder="Search invoices…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}>
          {['All', 'Draft', 'Sent', 'Paid', 'Overdue'].map(s => <option key={s}>{s}</option>)}
        </select>
        <button className="btn btn-ghost" onClick={() => { setSearch(''); setFilterStatus('All'); }} style={{ fontSize: 13 }}>
          <i className="ti ti-x"></i> Clear
        </button>
      </div>

      {/* Table */}
      <div className="card table-wrap" style={{ padding: 0, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th>Invoice #</th><th>Client</th><th>Amount</th><th>Issued</th><th>Due</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => (
              <tr key={inv.id} style={{ cursor: 'pointer' }} onClick={() => openEdit(inv)}>
                <td><span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{inv.id}</span></td>
                <td style={{ fontWeight: 500 }}>{inv.client}</td>
                <td style={{ fontWeight: 700, color: 'var(--emerald-light)', fontVariantNumeric: 'tabular-nums' }}>{fmt(inv.amount)}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{inv.issued}</td>
                <td style={{ color: inv.status === 'Overdue' ? 'var(--rose-light)' : 'var(--text-secondary)', fontWeight: inv.status === 'Overdue' ? 600 : 400 }}>{inv.due}</td>
                <td><span className={STATUS_BADGE[inv.status]}>{inv.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                    {(inv.status === 'Sent' || inv.status === 'Overdue') && (
                      <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <i className="ti ti-send"></i> Remind
                      </button>
                    )}
                    {inv.status === 'Paid' && (
                      <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <i className="ti ti-download"></i> PDF
                      </button>
                    )}
                    <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => openEdit(inv)}>
                      <i className="ti ti-edit"></i> Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No invoices match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: 460, padding: 24, background: 'var(--bg-secondary)', border: '1px solid var(--border-bright)', boxShadow: '0 12px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>{editingId ? 'Edit Invoice' : 'Create Invoice'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Client</label>
                <input type="text" value={mClient} onChange={e => setMClient(e.target.value)} placeholder="e.g. Nexus Retail"
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Amount (₹)</label>
                  <input type="number" value={mAmount} onChange={e => setMAmount(e.target.value)} placeholder="0"
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Due Date</label>
                  <input type="text" value={mDue} onChange={e => setMDue(e.target.value)} placeholder="e.g. Jun 30"
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Status</label>
                <select value={mStatus} onChange={e => setMStatus(e.target.value as Invoice['status'])}
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}>
                  {['Draft', 'Sent', 'Paid', 'Overdue'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              {editingId ? <button className="btn btn-ghost" style={{ color: 'var(--rose)' }} onClick={() => handleDelete(editingId)}>Delete</button> : <div />}
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave}>{editingId ? 'Save Changes' : 'Create Invoice'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
