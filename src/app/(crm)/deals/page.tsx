'use client';
import { useState, useRef, useEffect, useMemo } from 'react';

/* ─── Data ─── */
const pipelines = [
  { id: 'main', label: 'Main Sales Pipeline', icon: '🛤️', deals: 12 },
  { id: 'enterprise', label: 'Enterprise Pipeline', icon: '🏢', deals: 5 },
  { id: 'smb', label: 'SMB Pipeline', icon: '🏪', deals: 8 },
  { id: 'partnerships', label: 'Partnerships Pipeline', icon: '🤝', deals: 3 },
];

type Deal = {
  id: number;
  name: string;
  client: string;
  value: number;
  stage: string;
  owner: string;
  ownerFull: string;
  tags: string[];
  probability: number;
  daysInStage: number;
  nextFollowUp: string;
  source: string;
  created: string;
};

const initialDeals: Deal[] = [
  { id: 1, name: 'Website Redesign Project', client: 'BloomAds', value: 450000, stage: 'qualified', owner: 'JS', ownerFull: 'Jose L.', tags: ['SEO', 'Web Dev'], probability: 65, daysInStage: 3, nextFollowUp: 'Tomorrow', source: 'Meta Ads', created: '2d ago' },
  { id: 2, name: 'Social Media Campaign', client: 'GrowthLab', value: 180000, stage: 'proposal', owner: 'SA', ownerFull: 'Sarah A.', tags: ['Social', 'Content'], probability: 80, daysInStage: 5, nextFollowUp: 'Today', source: 'Referral', created: '5d ago' },
  { id: 3, name: 'Full CRM Implementation', client: 'NexaDigital', value: 720000, stage: 'negotiation', owner: 'JS', ownerFull: 'Jose L.', tags: ['CRM', 'Enterprise'], probability: 90, daysInStage: 8, nextFollowUp: 'Jun 25', source: 'LinkedIn', created: '12d ago' },
  { id: 4, name: 'Email Marketing Suite', client: 'MediaCo', value: 95000, stage: 'new', owner: 'AM', ownerFull: 'Alex M.', tags: ['Email', 'Automation'], probability: 20, daysInStage: 1, nextFollowUp: 'Today', source: 'Cold Email', created: '1d ago' },
  { id: 5, name: 'Brand Identity Package', client: 'BrandNest', value: 310000, stage: 'engaged', owner: 'SA', ownerFull: 'Sarah A.', tags: ['Design', 'Branding'], probability: 45, daysInStage: 4, nextFollowUp: 'Jun 26', source: 'Website Form', created: '6d ago' },
  { id: 6, name: 'SEO Audit & Strategy', client: 'ScaleUp', value: 165000, stage: 'won', owner: 'JS', ownerFull: 'Jose L.', tags: ['SEO', 'Analytics'], probability: 100, daysInStage: 0, nextFollowUp: '—', source: 'Referral', created: '18d ago' },
  { id: 7, name: 'Video Production Campaign', client: 'ClickFarm', value: 520000, stage: 'proposal', owner: 'AM', ownerFull: 'Alex M.', tags: ['Video', 'Content'], probability: 70, daysInStage: 6, nextFollowUp: 'Jun 24', source: 'Meta Ads', created: '8d ago' },
  { id: 8, name: 'PPC Management', client: 'AdSphere', value: 280000, stage: 'qualified', owner: 'JS', ownerFull: 'Jose L.', tags: ['PPC', 'Ads'], probability: 55, daysInStage: 2, nextFollowUp: 'Jun 27', source: 'LinkedIn DM', created: '3d ago' },
  { id: 9, name: 'Content Strategy Retainer', client: 'BoldMark', value: 420000, stage: 'won', owner: 'SA', ownerFull: 'Sarah A.', tags: ['Content', 'Strategy'], probability: 100, daysInStage: 0, nextFollowUp: '—', source: 'Referral', created: '21d ago' },
  { id: 10, name: 'App Development MVP', client: 'SprintCo', value: 890000, stage: 'lost', owner: 'AM', ownerFull: 'Alex M.', tags: ['Dev', 'Mobile'], probability: 0, daysInStage: 15, nextFollowUp: '—', source: 'Cold Email', created: '25d ago' },
  { id: 11, name: 'Analytics Dashboard', client: 'FreshBrand', value: 210000, stage: 'engaged', owner: 'JS', ownerFull: 'Jose L.', tags: ['Analytics', 'Dashboard'], probability: 40, daysInStage: 3, nextFollowUp: 'Jun 28', source: 'Website Form', created: '4d ago' },
  { id: 12, name: 'Influencer Campaign', client: 'TechVibe', value: 340000, stage: 'new', owner: 'SA', ownerFull: 'Sarah A.', tags: ['Social', 'Influencer'], probability: 15, daysInStage: 0, nextFollowUp: 'Today', source: 'Meta Ads', created: '6h ago' },
];

const stageConfig: Record<string, { label: string; color: string; headerColor: string }> = {
  new: { label: 'New Enquiry', color: 'new', headerColor: '#3b82f6' },
  engaged: { label: 'Engaged', color: 'engaged', headerColor: '#7c5cbf' },
  qualified: { label: 'Qualified', color: 'qualified', headerColor: '#f59e0b' },
  proposal: { label: 'Proposal Sent', color: 'proposal', headerColor: '#6366f1' },
  negotiation: { label: 'Negotiation', color: 'negotiation', headerColor: '#f97316' },
  won: { label: 'Closed Win', color: 'won', headerColor: '#10b981' },
  lost: { label: 'Closed Lose', color: 'lost', headerColor: '#f43f5e' },
};

const notifications = [
  { id: 1, type: 'deal', text: 'Raj Verma moved to Negotiation stage', time: '5m ago', read: false },
  { id: 2, type: 'assign', text: 'You were assigned "Analytics Dashboard"', time: '12m ago', read: false },
  { id: 3, type: 'followup', text: 'Follow-up reminder: GrowthLab call today', time: '30m ago', read: false },
  { id: 4, type: 'deal', text: 'BoldMark deal closed — ₹4.2L won!', time: '1h ago', read: true },
  { id: 5, type: 'assign', text: 'Sarah A. assigned "Influencer Campaign"', time: '2h ago', read: true },
  { id: 6, type: 'followup', text: 'Follow-up with MediaCo overdue', time: '3h ago', read: true },
];

function fmtVal(v: number) {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  return `₹${(v / 1000).toFixed(0)}K`;
}

/* ─── Reusable Dropdown Hook ─── */
function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return { open, setOpen, ref };
}

/* ─── Notification Drawer ─── */
function NotificationDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'absolute', top: 0, right: 0, bottom: 0,
          width: 380, maxWidth: '95vw',
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border)',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.3)',
          display: 'flex', flexDirection: 'column',
          animation: 'slideInRight 0.3s ease forwards',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
              Notifications
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {notifications.filter(n => !n.read).length} unread
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: 13, fontFamily: 'Inter, sans-serif',
            }}
          >✕</button>
        </div>

        {/* Notifications List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
          {notifications.map(n => (
            <div
              key={n.id}
              style={{
                padding: '14px 16px',
                borderRadius: 10,
                background: n.read ? 'transparent' : 'var(--purple-dim)',
                border: `1px solid ${n.read ? 'transparent' : 'rgba(124,92,191,0.2)'}`,
                marginBottom: 6,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{
                  fontSize: 16, marginTop: 1,
                }}>
                  {n.type === 'deal' ? '🤝' : n.type === 'assign' ? '👤' : '⏰'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 13,
                    color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)',
                    fontWeight: n.read ? 400 : 500,
                    lineHeight: 1.4,
                  }}>
                    {n.text}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{n.time}</div>
                </div>
                {!n.read && (
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--purple)', marginTop: 4,
                    boxShadow: '0 0 6px var(--purple)',
                  }} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          display: 'flex', gap: 8,
        }}>
          <button className="btn btn-ghost" style={{ flex: 1, fontSize: 12, justifyContent: 'center' }}>Mark All Read</button>
          <button className="btn btn-ghost" style={{ flex: 1, fontSize: 12, justifyContent: 'center' }}>View All</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Help Panel ─── */
function HelpPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  const helpItems = [
    { icon: '📖', label: 'CRM Documentation', desc: 'Complete feature reference guide' },
    { icon: '🎓', label: 'User Guide', desc: 'Step-by-step getting started guide' },
    { icon: '🎬', label: 'Video Tutorials', desc: 'Watch how-to walkthroughs' },
    { icon: '💬', label: 'Live Chat Support', desc: 'Talk to our team in real-time' },
    { icon: '🐛', label: 'Report a Bug', desc: 'Submit an issue for the dev team' },
    { icon: '💡', label: 'Feature Request', desc: 'Suggest improvements or new features' },
  ];
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 16, padding: 0,
        width: 440, maxWidth: '95vw',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        overflow: 'hidden',
        animation: 'fadeIn 0.25s ease',
      }}>
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(135deg, var(--purple-dim), var(--blue-dim))',
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
            Help & Resources
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            Find answers, learn features, and get support
          </div>
        </div>
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {helpItems.map(item => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 14px', borderRadius: 10,
              cursor: 'pointer', transition: 'all 0.2s',
              border: '1px solid transparent',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{item.desc}</div>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>→</span>
            </div>
          ))}
        </div>
        <div style={{ padding: '12px 20px 16px', borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ─── User Profile Dropdown ─── */
function UserProfileDropdown({ open, ref: dropRef }: { open: boolean; ref: React.RefObject<HTMLDivElement | null> }) {
  if (!open) return null;
  const items = [
    { icon: '👤', label: 'Profile Settings', desc: 'Edit your personal info' },
    { icon: '⚙️', label: 'Account Preferences', desc: 'Notifications, language, timezone' },
    { icon: '🔒', label: 'Security', desc: 'Password & 2FA settings' },
    { icon: '🎨', label: 'Appearance', desc: 'Theme & display preferences' },
  ];
  return (
    <div style={{
      position: 'absolute', top: '100%', right: 0, marginTop: 8,
      width: 280,
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
      overflow: 'hidden',
      zIndex: 100,
      animation: 'fadeIn 0.2s ease',
    }}>
      {/* User Card */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(135deg, var(--purple-dim), var(--blue-dim))',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--purple), var(--blue))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 700, color: 'white',
          boxShadow: '0 4px 12px rgba(124,92,191,0.3)',
        }}>JL</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Jose L.</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Administrator</div>
        </div>
      </div>
      {/* Items */}
      <div style={{ padding: '6px 8px' }}>
        {items.map(item => (
          <div key={item.label} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 10px', borderRadius: 8,
            cursor: 'pointer', transition: 'all 0.2s',
            fontSize: 13, color: 'var(--text-secondary)',
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
            }}
          >
            <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>{item.icon}</span>
            <div>
              <div style={{ fontWeight: 500 }}>{item.label}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Logout */}
      <div style={{ padding: '8px', borderTop: '1px solid var(--border)' }}>
        <button style={{
          width: '100%', padding: '10px',
          background: 'var(--rose-dim)', color: 'var(--rose-light)',
          border: '1px solid rgba(244,63,94,0.2)',
          borderRadius: 8, cursor: 'pointer',
          fontSize: 13, fontWeight: 600,
          fontFamily: 'Inter, sans-serif',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'all 0.2s',
        }}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

/* ─── Deal Form Modal (Create / Edit) ─── */
const emptyDealForm = {
  name: '', client: '', value: '', stage: 'new',
  owner: 'JS', ownerFull: 'Jose L.',
  tags: '', probability: 50, source: 'Meta Ads',
  nextFollowUp: '',
};
type DealFormState = typeof emptyDealForm;

const sourceOptions = ['Meta Ads', 'Website Form', 'Referral', 'LinkedIn', 'LinkedIn DM', 'Cold Email', 'Other'];

function DealFormModal({
  title, form, errors, onChange, onSubmit, onClose, submitLabel,
}: {
  title: string;
  form: DealFormState;
  errors: Record<string, string>;
  onChange: (k: keyof DealFormState, v: string | number) => void;
  onSubmit: () => void;
  onClose: () => void;
  submitLabel: string;
}) {
  const inputStyle = (key: string) => ({
    background: 'var(--bg-secondary)',
    border: `1px solid ${errors[key] ? 'var(--rose)' : 'var(--border)'}`,
    borderRadius: 8, padding: '8px 12px',
    color: 'var(--text-primary)', fontSize: 13,
    fontFamily: 'Inter, sans-serif', outline: 'none',
    width: '100%', boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
  });
  const labelStyle = {
    fontSize: 11, fontWeight: 600 as const,
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  };
  const selectStyle = {
    ...inputStyle(''),
    cursor: 'pointer',
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 16, padding: 0, width: 560, maxWidth: '95vw',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        animation: 'fadeIn 0.25s ease',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(135deg, var(--purple-dim), var(--blue-dim))',
          borderRadius: '16px 16px 0 0',
        }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Fill in the deal details below</div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 16 }}>✕</button>
        </div>

        {/* Form Grid */}
        <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {/* Deal Name */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Deal Name *</label>
            <input style={inputStyle('name')} value={form.name} placeholder="e.g. Website Redesign Project"
              onChange={e => onChange('name', e.target.value)} />
            {errors.name && <span style={{ fontSize: 11, color: 'var(--rose-light)' }}>{errors.name}</span>}
          </div>
          {/* Client */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Client / Company *</label>
            <input style={inputStyle('client')} value={form.client} placeholder="e.g. BloomAds"
              onChange={e => onChange('client', e.target.value)} />
            {errors.client && <span style={{ fontSize: 11, color: 'var(--rose-light)' }}>{errors.client}</span>}
          </div>
          {/* Value */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Value (₹) *</label>
            <input type="number" style={inputStyle('value')} value={form.value} placeholder="0"
              onChange={e => onChange('value', e.target.value)} />
            {errors.value && <span style={{ fontSize: 11, color: 'var(--rose-light)' }}>{errors.value}</span>}
          </div>
          {/* Stage */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Pipeline Stage</label>
            <select style={selectStyle} value={form.stage} onChange={e => onChange('stage', e.target.value)}>
              {Object.entries(stageConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          {/* Source */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Source</label>
            <select style={selectStyle} value={form.source} onChange={e => onChange('source', e.target.value)}>
              {sourceOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {/* Tags */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Tags (comma-separated)</label>
            <input style={inputStyle('tags')} value={form.tags} placeholder="e.g. SEO, Web Dev"
              onChange={e => onChange('tags', e.target.value)} />
          </div>
          {/* Owner */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Owner Initials</label>
            <input style={inputStyle('owner')} value={form.owner} placeholder="JS"
              onChange={e => onChange('owner', e.target.value)} />
          </div>
          {/* Probability */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Win Probability (0–100)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="range" min={0} max={100} value={form.probability}
                onChange={e => onChange('probability', Number(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--purple)' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', minWidth: 32, textAlign: 'right' }}>{form.probability}%</span>
            </div>
          </div>
          {/* Follow-up */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Next Follow-up</label>
            <input style={inputStyle('nextFollowUp')} value={form.nextFollowUp} placeholder="e.g. Tomorrow, Jun 25"
              onChange={e => onChange('nextFollowUp', e.target.value)} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 24px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={onSubmit} className="btn btn-primary">{submitLabel}</button>
        </div>
      </div>
    </div>
  );
}

/* ─── View Deal Detail Drawer ─── */
function ViewDealDrawer({ deal, onClose, onEdit }: { deal: Deal; onClose: () => void; onEdit: () => void }) {
  const stg = stageConfig[deal.stage];
  const fields = [
    { icon: '🏢', label: 'Client', value: deal.client },
    { icon: '💰', label: 'Value', value: fmtVal(deal.value) },
    { icon: '📊', label: 'Stage', value: stg.label, badge: stg.color },
    { icon: '🎯', label: 'Probability', value: `${deal.probability}%` },
    { icon: '👤', label: 'Owner', value: deal.ownerFull },
    { icon: '📥', label: 'Source', value: deal.source },
    { icon: '📅', label: 'Created', value: deal.created },
    { icon: '⏰', label: 'Next Follow-up', value: deal.nextFollowUp },
    { icon: '🕐', label: 'Days in Stage', value: `${deal.daysInStage} days` },
  ];
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: 440, maxWidth: '95vw',
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border)',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideInRight 0.3s ease forwards',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(135deg, var(--purple-dim), var(--blue-dim))',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', lineHeight: 1.3 }}>
                {deal.name}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{deal.client}</div>
            </div>
            <button onClick={onClose} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: 13, fontFamily: 'Inter, sans-serif',
            }}>✕</button>
          </div>
          {/* Tags */}
          <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
            {deal.tags.map(t => (
              <span key={t} style={{
                fontSize: 11, padding: '3px 10px', borderRadius: 6,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', fontWeight: 500,
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Value Banner */}
        <div style={{
          margin: '16px 16px 0',
          padding: '16px 20px',
          background: 'var(--emerald-dim)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deal Value</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--emerald-light)', fontFamily: 'Outfit, sans-serif', lineHeight: 1.2, marginTop: 2 }}>
              {fmtVal(deal.value)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weighted</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', lineHeight: 1.2, marginTop: 2 }}>
              {fmtVal(Math.round(deal.value * deal.probability / 100))}
            </div>
          </div>
        </div>

        {/* Probability Bar */}
        <div style={{ margin: '12px 16px 0', padding: '14px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Win Probability</span>
            <span style={{
              fontSize: 13, fontWeight: 700,
              color: deal.probability >= 80 ? 'var(--emerald-light)' : deal.probability >= 50 ? 'var(--amber-light)' : 'var(--rose-light)',
            }}>{deal.probability}%</span>
          </div>
          <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              width: `${deal.probability}%`, height: '100%',
              background: deal.probability >= 80 ? 'var(--emerald)' : deal.probability >= 50 ? 'var(--amber)' : 'var(--rose)',
              borderRadius: 3, transition: 'width 0.4s ease',
            }} />
          </div>
        </div>

        {/* Detail Fields */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {fields.map(f => (
            <div key={f.label} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 8,
              borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 16, width: 24, textAlign: 'center' }}>{f.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{f.label}</div>
                {f.badge ? (
                  <span className={`badge ${f.badge}`} style={{ marginTop: 2 }}>{f.value}</span>
                ) : (
                  <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500, marginTop: 1 }}>{f.value}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          display: 'flex', gap: 8,
        }}>
          <button onClick={onEdit} style={{
            flex: 1, padding: '10px',
            background: 'var(--blue-dim)', color: 'var(--blue-light)',
            border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8,
            cursor: 'pointer', fontSize: 13, fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>✏️ Edit Deal</button>
          <button onClick={onClose} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Delete Confirm Modal ─── */
function DeleteConfirmModal({ deal, onConfirm, onClose }: { deal: Deal; onConfirm: () => void; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 16, padding: 28, width: 400, maxWidth: '95vw',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        display: 'flex', flexDirection: 'column', gap: 16,
        animation: 'fadeIn 0.2s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'var(--rose-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>🗑️</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>Delete Deal</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>This action cannot be undone</div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, padding: '8px 0' }}>
          Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{deal.name}</strong> from <strong style={{ color: 'var(--text-primary)' }}>{deal.client}</strong>?
          <br />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Deal value: {fmtVal(deal.value)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4, borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={onConfirm} style={{
            background: 'var(--rose)', color: 'white', border: 'none',
            borderRadius: 8, padding: '8px 18px', fontSize: 13,
            fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 12px rgba(244,63,94,0.3)',
            transition: 'all 0.2s',
          }}>Delete Deal</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN DEALS PAGE
   ═══════════════════════════════════════════ */
export default function DealsPage() {
  const [selectedPipeline, setSelectedPipeline] = useState('main');
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Sort
  type SortKey = 'name' | 'client' | 'value' | 'stage' | 'probability' | 'daysInStage' | 'source';
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  // Create / Edit modal
  const [showDealForm, setShowDealForm] = useState(false);
  const [dealForm, setDealForm] = useState<DealFormState>({ ...emptyDealForm });
  const [dealFormErrors, setDealFormErrors] = useState<Record<string, string>>({});
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  // View detail
  const [viewDeal, setViewDeal] = useState<Deal | null>(null);

  // Delete confirm
  const [deleteDeal, setDeleteDeal] = useState<Deal | null>(null);

  // Search suggestions
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Dropdowns
  const pipelineDrop = useDropdown();
  const profileDrop = useDropdown();

  // Filtering
  const filtered = deals.filter(d => {
    const matchStage = stageFilter === 'all' || d.stage === stageFilter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      d.name.toLowerCase().includes(q) ||
      d.client.toLowerCase().includes(q) ||
      d.tags.some(t => t.toLowerCase().includes(q)) ||
      d.owner.toLowerCase().includes(q) ||
      d.ownerFull.toLowerCase().includes(q) ||
      d.stage.toLowerCase().includes(q);
    return matchStage && matchSearch;
  });

  // Search suggestions
  const suggestions = search.length >= 2 ? [
    ...deals.filter(d => d.name.toLowerCase().includes(search.toLowerCase())).slice(0, 3).map(d => ({ type: 'Deal', label: d.name, sub: d.client })),
    ...deals.filter(d => d.client.toLowerCase().includes(search.toLowerCase())).slice(0, 2).map(d => ({ type: 'Client', label: d.client, sub: fmtVal(d.value) })),
    ...[...new Set(deals.flatMap(d => d.tags))].filter(t => t.toLowerCase().includes(search.toLowerCase())).slice(0, 2).map(t => ({ type: 'Tag', label: t, sub: `${deals.filter(d => d.tags.includes(t)).length} deals` })),
  ] : [];

  // KPIs
  const totalValue = deals.reduce((a, d) => a + d.value, 0);
  const wonValue = deals.filter(d => d.stage === 'won').reduce((a, d) => a + d.value, 0);
  const activeDeals = deals.filter(d => !['won', 'lost'].includes(d.stage)).length;
  const avgDeal = deals.length ? Math.round(totalValue / deals.length) : 0;

  // Delete
  const handleDelete = (id: number) => {
    setDeals(prev => prev.filter(d => d.id !== id));
  };

  const selectedPipelineData = pipelines.find(p => p.id === selectedPipeline)!;

  /* Highlight matched text */
  const highlight = (text: string) => {
    if (!search) return text;
    const idx = text.toLowerCase().indexOf(search.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span style={{ background: 'var(--amber-dim)', color: 'var(--amber-light)', padding: '0 2px', borderRadius: 3, fontWeight: 600 }}>
          {text.slice(idx, idx + search.length)}
        </span>
        {text.slice(idx + search.length)}
      </>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ════════════════════════════════════════
          TOP NAVIGATION BAR
          ════════════════════════════════════════ */}
      <div id="deals-topnav" style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 0 16px',
        borderBottom: '1px solid var(--border)',
        marginBottom: 16,
        flexWrap: 'wrap',
      }}>

        {/* 1. Pipeline Selector Dropdown */}
        <div ref={pipelineDrop.ref} style={{ position: 'relative' }}>
          <button
            id="pipeline-selector"
            onClick={() => pipelineDrop.setOpen(!pipelineDrop.open)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              cursor: 'pointer',
              color: 'var(--text-primary)',
              fontFamily: 'Inter, sans-serif',
              fontSize: 13, fontWeight: 600,
              transition: 'all 0.2s',
              minWidth: 220,
            }}
          >
            <span style={{ fontSize: 16 }}>{selectedPipelineData.icon}</span>
            <span style={{ flex: 1, textAlign: 'left' }}>{selectedPipelineData.label}</span>
            <span style={{
              fontSize: 10, color: 'var(--text-muted)',
              transform: pipelineDrop.open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}>▼</span>
          </button>

          {pipelineDrop.open && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, marginTop: 6,
              width: 280,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              zIndex: 100,
              animation: 'fadeIn 0.2s ease',
            }}>
              <div style={{ padding: '10px 12px 6px', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Select Pipeline
              </div>
              {pipelines.map(p => (
                <div
                  key={p.id}
                  onClick={() => { setSelectedPipeline(p.id); pipelineDrop.setOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', margin: '2px 6px',
                    borderRadius: 8, cursor: 'pointer',
                    background: selectedPipeline === p.id ? 'var(--purple-dim)' : 'transparent',
                    color: selectedPipeline === p.id ? 'var(--purple-light)' : 'var(--text-secondary)',
                    transition: 'all 0.15s',
                    fontSize: 13, fontWeight: selectedPipeline === p.id ? 600 : 400,
                  }}
                  onMouseEnter={e => {
                    if (selectedPipeline !== p.id) (e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)';
                  }}
                  onMouseLeave={e => {
                    if (selectedPipeline !== p.id) (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <span style={{ fontSize: 16 }}>{p.icon}</span>
                  <span style={{ flex: 1 }}>{p.label}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600,
                    padding: '2px 8px', borderRadius: 6,
                    background: 'var(--bg-card)', color: 'var(--text-muted)',
                  }}>{p.deals}</span>
                  {selectedPipeline === p.id && <span style={{ color: 'var(--purple-light)', fontSize: 12 }}>✓</span>}
                </div>
              ))}
              <div style={{ padding: '6px 6px 8px' }}>
                <div style={{
                  padding: '8px 14px', margin: '0 2px',
                  borderRadius: 8, cursor: 'pointer',
                  fontSize: 12, color: 'var(--purple-light)',
                  display: 'flex', alignItems: 'center', gap: 8,
                  border: '1px dashed var(--border)',
                  transition: 'all 0.2s',
                }}>
                  <span>+</span> Create New Pipeline
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Global Search Bar */}
        <div ref={searchRef} style={{ position: 'relative', flex: 1, minWidth: 260 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 14px',
            background: searchFocused ? 'var(--bg-card-hover)' : 'var(--bg-card)',
            border: `1px solid ${searchFocused ? 'var(--purple)' : 'var(--border)'}`,
            borderRadius: 10,
            transition: 'all 0.2s',
            boxShadow: searchFocused ? '0 0 0 3px var(--purple-dim)' : 'none',
          }}>
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>🔍</span>
            <input
              id="deals-global-search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search deals, clients, or tags..."
              style={{
                flex: 1, background: 'transparent', border: 'none',
                color: 'var(--text-primary)', fontSize: 13,
                fontFamily: 'Inter, sans-serif', outline: 'none',
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 6, padding: '2px 8px', cursor: 'pointer',
                color: 'var(--text-muted)', fontSize: 10,
                fontFamily: 'Inter, sans-serif',
              }}>✕</button>
            )}
            <span style={{
              fontSize: 10, color: 'var(--text-muted)',
              background: 'rgba(255,255,255,0.06)',
              padding: '2px 7px', borderRadius: 4,
              border: '1px solid var(--border)',
            }}>⌘K</span>
          </div>

          {/* Search Suggestions */}
          {searchFocused && suggestions.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              marginTop: 6,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              zIndex: 100,
              animation: 'fadeIn 0.15s ease',
            }}>
              <div style={{ padding: '8px 14px 4px', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Suggestions
              </div>
              {suggestions.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 14px', cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  onClick={() => { setSearch(s.label); setSearchFocused(false); }}
                >
                  <span style={{
                    fontSize: 9, fontWeight: 600, padding: '2px 6px',
                    borderRadius: 4,
                    background: s.type === 'Deal' ? 'var(--blue-dim)' : s.type === 'Client' ? 'var(--emerald-dim)' : 'var(--amber-dim)',
                    color: s.type === 'Deal' ? 'var(--blue-light)' : s.type === 'Client' ? 'var(--emerald-light)' : 'var(--amber-light)',
                    textTransform: 'uppercase',
                  }}>{s.type}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{s.label}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>{s.sub}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Notification Icon */}
        <button
          id="notification-btn"
          onClick={() => setShowNotifications(true)}
          style={{
            position: 'relative',
            width: 38, height: 38,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
            transition: 'all 0.2s',
          }}
        >
          🔔
          <span style={{
            position: 'absolute', top: 4, right: 4,
            minWidth: 16, height: 16, borderRadius: 8,
            background: 'var(--rose)',
            color: 'white', fontSize: 9, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--bg-secondary)',
            padding: '0 3px',
          }}>3</span>
        </button>

        {/* 4. Help Icon */}
        <button
          id="help-btn"
          onClick={() => setShowHelp(true)}
          style={{
            width: 38, height: 38,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
            transition: 'all 0.2s',
          }}
        >
          ❓
        </button>

        {/* 5. User Profile Section */}
        <div ref={profileDrop.ref} style={{ position: 'relative' }}>
          <button
            id="user-profile-btn"
            onClick={() => profileDrop.setOpen(!profileDrop.open)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '6px 12px 6px 6px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--purple), var(--blue))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: 'white',
              boxShadow: '0 2px 8px rgba(124,92,191,0.25)',
            }}>JL</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>Jose L.</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.2 }}>Admin</div>
            </div>
            <span style={{
              fontSize: 10, color: 'var(--text-muted)',
              transform: profileDrop.open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}>▼</span>
          </button>
          <UserProfileDropdown open={profileDrop.open} ref={profileDrop.ref} />
        </div>
      </div>

      {/* ════════════════════════════════════════
          KPI CARDS
          ════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 16 }}>
        {[
          { label: 'Total Pipeline Value', value: fmtVal(totalValue), color: 'purple', icon: '💰' },
          { label: 'Closed Won', value: fmtVal(wonValue), color: 'emerald', icon: '🏆' },
          { label: 'Active Deals', value: String(activeDeals), color: 'blue', icon: '📊' },
          { label: 'Avg. Deal Size', value: fmtVal(avgDeal), color: 'amber', icon: '📈' },
        ].map(k => (
          <div key={k.label} className={`kpi-card ${k.color}`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div className="kpi-label">{k.label}</div>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: `var(--${k.color}-dim)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
              }}>{k.icon}</div>
            </div>
            <div className="kpi-value">{k.value}</div>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════
          VIEW TOGGLE & FILTERS
          ════════════════════════════════════════ */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* View toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            {(['list', 'kanban'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: '7px 16px', fontSize: 12, fontWeight: 600,
                background: view === v ? 'var(--purple-dim)' : 'transparent',
                color: view === v ? 'var(--purple-light)' : 'var(--text-muted)',
                border: 'none', cursor: 'pointer',
                borderRight: '1px solid var(--border)',
                fontFamily: 'Inter, sans-serif', textTransform: 'capitalize',
              }}>
                {v === 'list' ? '≡ List' : '⬡ Kanban'}
              </button>
            ))}
          </div>

          {/* Stage filter pills */}
          <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            {['all', 'new', 'engaged', 'qualified', 'proposal', 'negotiation', 'won', 'lost'].map(f => (
              <button key={f} onClick={() => setStageFilter(f)} style={{
                padding: '7px 10px', fontSize: 11, fontWeight: 600,
                background: stageFilter === f ? 'var(--purple-dim)' : 'transparent',
                color: stageFilter === f ? 'var(--purple-light)' : 'var(--text-muted)',
                border: 'none', cursor: 'pointer', textTransform: 'capitalize',
                borderRight: '1px solid var(--border)',
                fontFamily: 'Inter, sans-serif',
              }}>
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-primary">+ New Deal</button>
      </div>

      {/* ════════════════════════════════════════
          LIST VIEW
          ════════════════════════════════════════ */}
      {view === 'list' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Deal</th>
                  <th>Client</th>
                  <th>Value</th>
                  <th>Stage</th>
                  <th>Tags</th>
                  <th>Probability</th>
                  <th>Days</th>
                  <th>Follow-up</th>
                  <th>Owner</th>
                  <th>Source</th>
                  <th style={{ textAlign: 'right', paddingRight: 12 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => {
                  const stg = stageConfig[d.stage];
                  return (
                    <tr key={d.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{highlight(d.name)}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{highlight(d.client)}</td>
                      <td style={{ fontWeight: 700, color: 'var(--emerald-light)', fontSize: 13 }}>{fmtVal(d.value)}</td>
                      <td><span className={`badge ${stg.color}`}>{stg.label}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {d.tags.map(t => (
                            <span key={t} style={{
                              fontSize: 10, padding: '2px 7px', borderRadius: 6,
                              background: 'var(--bg-card)', border: '1px solid var(--border)',
                              color: 'var(--text-muted)',
                            }}>{highlight(t)}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{
                              width: `${d.probability}%`, height: '100%',
                              background: d.probability >= 80 ? 'var(--emerald)' : d.probability >= 50 ? 'var(--amber)' : 'var(--rose)',
                              borderRadius: 2,
                            }} />
                          </div>
                          <span style={{
                            fontSize: 12, fontWeight: 700,
                            color: d.probability >= 80 ? 'var(--emerald-light)' : d.probability >= 50 ? 'var(--amber-light)' : 'var(--rose-light)',
                          }}>{d.probability}%</span>
                        </div>
                      </td>
                      <td style={{
                        fontSize: 12,
                        color: d.daysInStage > 10 ? 'var(--rose-light)' : 'var(--text-muted)',
                      }}>{d.daysInStage}d</td>
                      <td style={{
                        fontSize: 12,
                        color: d.nextFollowUp === 'Today' ? 'var(--amber-light)' : d.nextFollowUp === 'Tomorrow' ? 'var(--blue-light)' : 'var(--text-muted)',
                        fontWeight: d.nextFollowUp === 'Today' ? 600 : 400,
                      }}>
                        {d.nextFollowUp === 'Today' && '⚡ '}
                        {d.nextFollowUp}
                      </td>
                      <td>
                        <div style={{
                          width: 26, height: 26, borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--purple), var(--blue))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 9, fontWeight: 700, color: 'white',
                        }} title={d.ownerFull}>{d.owner}</div>
                      </td>
                      <td><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.source}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                          <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }}>View</button>
                          <button
                            onClick={() => handleDelete(d.id)}
                            style={{
                              padding: '4px 10px', fontSize: 11,
                              background: 'rgba(239,68,68,0.1)',
                              color: 'var(--rose-light)',
                              border: '1px solid var(--rose)',
                              borderRadius: 7, cursor: 'pointer',
                              fontFamily: 'Inter, sans-serif', fontWeight: 600,
                            }}
                          >Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          KANBAN VIEW
          ════════════════════════════════════════ */}
      {view === 'kanban' && (
        <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
          <div style={{ display: 'flex', gap: 12, minWidth: 'max-content' }}>
            {Object.entries(stageConfig).map(([stageId, cfg]) => {
              const stageDeals = filtered.filter(d => d.stage === stageId);
              const stageValue = stageDeals.reduce((a, d) => a + d.value, 0);
              return (
                <div key={stageId} style={{ width: 240, flexShrink: 0 }}>
                  {/* Column Header */}
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderTop: `3px solid ${cfg.headerColor}`,
                    borderRadius: '10px 10px 0 0',
                    padding: '12px 14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{cfg.label}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{fmtVal(stageValue)}</div>
                    </div>
                    <span style={{
                      background: `${cfg.headerColor}22`,
                      color: cfg.headerColor,
                      fontSize: 10, fontWeight: 700,
                      padding: '2px 8px', borderRadius: 8,
                    }}>{stageDeals.length}</span>
                  </div>

                  {/* Deal Cards */}
                  <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border)',
                    borderTop: 'none',
                    borderRadius: '0 0 10px 10px',
                    padding: '8px',
                    display: 'flex', flexDirection: 'column', gap: 8,
                    minHeight: 120,
                  }}>
                    {stageDeals.map(d => (
                      <div key={d.id} className="deal-card" style={{ position: 'relative' }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{d.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{d.client}</div>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                          {d.tags.map(t => (
                            <span key={t} style={{
                              fontSize: 9, padding: '1px 6px', borderRadius: 4,
                              background: 'var(--bg-card)', border: '1px solid var(--border)',
                              color: 'var(--text-muted)',
                            }}>{t}</span>
                          ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--emerald-light)' }}>{fmtVal(d.value)}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 10, color: d.daysInStage > 10 ? 'var(--rose-light)' : 'var(--text-muted)' }}>{d.daysInStage}d</span>
                            <div style={{
                              width: 22, height: 22, borderRadius: '50%',
                              background: 'linear-gradient(135deg, var(--purple), var(--blue))',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 8, fontWeight: 700, color: 'white',
                            }}>{d.owner}</div>
                          </div>
                        </div>
                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(d.id)}
                          style={{
                            position: 'absolute', top: 4, right: 4,
                            background: 'transparent', border: 'none',
                            color: 'var(--rose-light)', cursor: 'pointer', fontSize: 12,
                          }}
                        >✕</button>
                      </div>
                    ))}
                    <button style={{
                      border: '1px dashed var(--border)',
                      borderRadius: 8, padding: '8px',
                      fontSize: 11, color: 'var(--text-muted)',
                      background: 'transparent', cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}>+ Add Deal</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ Drawers & Modals ═══ */}
      <NotificationDrawer open={showNotifications} onClose={() => setShowNotifications(false)} />
      <HelpPanel open={showHelp} onClose={() => setShowHelp(false)} />

      {/* Inline animation keyframes */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
