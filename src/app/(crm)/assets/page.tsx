'use client';

export default function AssetsPage() {
  const kpis = [
    { label: 'Total files', value: '612', delta: 'Across all folders', trend: 'up', color: 'purple' },
    { label: 'Storage used', value: '4.8 GB', delta: 'of 10 GB', trend: 'up', color: 'blue' },
    { label: 'Images', value: '440', delta: '72% of total', trend: 'up', color: 'emerald' },
    { label: 'Videos', value: '38', delta: '6% of total', trend: 'up', color: 'amber' },
  ];

  const folders = [
    { name: 'Brand guidelines', count: 24, icon: '📁', color: 'var(--rose-light)' },
    { name: 'Campaign creatives', count: 118, icon: '📁', color: 'var(--purple-light)' },
    { name: 'Product screenshots', count: 76, icon: '📁', color: 'var(--blue-light)' },
    { name: 'Social media templates', count: 92, icon: '📁', color: 'var(--amber-light)' },
    { name: 'Videos & reels', count: 38, icon: '📁', color: 'var(--emerald-light)' },
  ];

  const recentUploads = [
    { name: 'hero-banner-v3.png', size: '1.2 MB', date: 'Jun 23', icon: '🖼️', bg: 'var(--rose-dim)', color: 'var(--rose-light)' },
    { name: 'brand-kit-2025.pdf', size: '4.4 MB', date: 'Jun 21', icon: '📄', bg: 'var(--blue-dim)', color: 'var(--blue-light)' },
    { name: 'product-demo-final.mp4', size: '84 MB', date: 'Jun 19', icon: '🎥', bg: 'var(--emerald-dim)', color: 'var(--emerald-light)' },
  ];

  const assetList = [
    { name: 'hero-banner-v3.png', type: 'Image', size: '1.2 MB', folder: 'Campaign creatives', badge: 'rose' },
    { name: 'brand-kit-2025.pdf', type: 'PDF', size: '4.4 MB', folder: 'Brand guidelines', badge: 'purple' },
    { name: 'product-demo-final.mp4', type: 'Video', size: '84 MB', folder: 'Videos & reels', badge: 'emerald' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="section-title" style={{ fontSize: 20 }}>Assets</div>
          <div className="section-sub" style={{ fontSize: 13 }}>Images, videos, brand files</div>
        </div>
        <button className="btn btn-primary">↑ Upload</button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {kpis.map((k) => (
          <div key={k.label} className={`kpi-card ${k.color}`}>
            <div className="kpi-header">
              <span className="kpi-label">{k.label}</span>
            </div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-delta" style={{ color: 'var(--text-muted)' }}>{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Two Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Folders */}
        <div className="card" style={{ padding: '16px 20px' }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Folders</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {folders.map((f, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', transition: 'background 0.2s' }} className="hover-bg-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
                  <span style={{ fontSize: 16 }}>{f.icon}</span> {f.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{f.count} files</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="card" style={{ padding: '16px 20px' }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Recent uploads</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentUploads.map((u, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < recentUploads.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: u.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  {u.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{u.size} • {u.date}</div>
                </div>
                <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 12 }}>↓</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Search assets..." 
          style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} 
        />
        <select style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}>
          <option>All types</option>
          <option>Images</option>
          <option>Videos</option>
          <option>Documents</option>
        </select>
      </div>

      {/* Table */}
      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: '36%' }}>File name</th>
              <th style={{ width: '14%' }}>Type</th>
              <th style={{ width: '14%' }}>Size</th>
              <th style={{ width: '18%' }}>Folder</th>
              <th style={{ width: '18%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assetList.map((a, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{a.name}</td>
                <td><span className={`badge ${a.badge}`}>{a.type}</span></td>
                <td>{a.size}</td>
                <td>{a.folder}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }}>View</button>
                    <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }}>Download</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add a tiny style injection for hover class since it's inline otherwise */}
      <style dangerouslySetInnerHTML={{__html: `
        .hover-bg-card:hover { background: var(--bg-card-hover); }
      `}} />
    </div>
  );
}
