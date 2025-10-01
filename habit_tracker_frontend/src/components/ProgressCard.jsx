import React from 'react';

export default function ProgressCard({ title, percent, helper }) {
  const p = Math.max(0, Math.min(100, Number(percent || 0)));
  return (
    <div className="card">
      <div className="card-title">
        <h4 style={{ margin: 0 }}>{title}</h4>
        <span className="badge">{p}%</span>
      </div>
      <div aria-label={`${title} progress`} style={{ height: 8, background: 'rgba(17,24,39,0.08)', borderRadius: 999 }}>
        <div style={{
          width: `${p}%`,
          height: 8,
          borderRadius: 999,
          background: 'linear-gradient(90deg, #2563EB, #60A5FA)'
        }} />
      </div>
      {helper && <div className="helper" style={{ marginTop: 8 }}>{helper}</div>}
    </div>
  );
}
