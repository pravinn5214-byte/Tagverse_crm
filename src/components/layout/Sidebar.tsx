'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navSections = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', icon: '⬡', label: 'Dashboard', path: '/dashboard' },
      { id: 'activity', icon: '⚡', label: 'Activity Feed', path: '/activity' },
    ],
  },
  {
    label: 'CRM',
    items: [
      { id: 'leads', icon: '👤', label: 'Contacts & Leads', badge: '24', path: '/leads' },
      { id: 'pipeline', icon: '⟳', label: 'Pipeline', badge: '12', path: '/pipeline' },
      { id: 'deals', icon: '🤝', label: 'Deals', path: '/deals' },
    ],
  },
  {
    label: 'Revenue',
    items: [
      { id: 'quotes', icon: '📄', label: 'Quotes', path: '/quotes' },
      { id: 'invoices', icon: '🧾', label: 'Invoices', badge: '3', path: '/invoices' },
      { id: 'contracts', icon: '✍', label: 'Contracts', path: '/contracts' },
      { id: 'payments', icon: '💳', label: 'Payments', path: '/payments' },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { id: 'email', icon: '✉', label: 'Email Marketing', path: '/email' },
      { id: 'social', icon: '📱', label: 'Social & Content', path: '/social' },
      { id: 'seo', icon: '🔍', label: 'SEO / AEO', path: '/seo' },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { id: 'tasks', icon: '✓', label: 'Task Manager', badge: '7', path: '/tasks' },
      { id: 'calendar', icon: '📅', label: 'Calendar', path: '/calendar' },
      { id: 'team', icon: '👥', label: 'Team', path: '/team' },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { id: 'analytics', icon: '📊', label: 'Analytics', path: '/analytics' },
      { id: 'reports', icon: '📋', label: 'Reports', path: '/reports' },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'automation', icon: '🤖', label: 'Automation (n8n)', path: '/automation' },
      { id: 'integrations', icon: '🔗', label: 'Integrations', path: '/integrations' },
      { id: 'webhooks', icon: '⚙', label: 'Webhooks', path: '/webhooks' },
      { id: 'settings', icon: '⚙', label: 'Settings', path: '/settings' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">T</div>
        <div>
          <div className="logo-text">Tagverse</div>
          <div className="logo-sub">CRM Platform</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 8 }}>
        {navSections.map((section) => (
          <div key={section.label} className="sidebar-section">
            <div className="sidebar-section-label">{section.label}</div>
            {section.items.map((item) => {
              const isActive = pathname === item.path || (item.path === '/dashboard' && pathname === '/');
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  style={{ textDecoration: 'none' }}
                >
                  <span className="icon">{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span className="sidebar-badge">{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="user-pill">
          <div className="user-avatar">JL</div>
          <div className="user-info">
            <div className="name">Jose L.</div>
            <div className="role">Administrator</div>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>•••</span>
        </div>
      </div>
    </aside>
  );
}
