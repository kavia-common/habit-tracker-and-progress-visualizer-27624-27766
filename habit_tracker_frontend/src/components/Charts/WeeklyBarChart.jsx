import React from 'react';

// PUBLIC_INTERFACE
export default function WeeklyBarChart({ data, labels }) {
  const max = Math.max(1, ...data);
  return (
    <div className="card">
      <div className="card-title">
        <h4 style={{ margin: 0 }}>Weekly Completion</h4>
      </div>
      <div className="chart" role="img" aria-label="Weekly completion chart">
        {data.map((v, i) => {
          const h = Math.round((v / max) * 100);
          return (
            <div key={i} className="bar" title={`${labels[i]}: ${v}`}>
              <div className="fill" style={{ height: `${h}%` }} />
            </div>
          );
        })}
      </div>
      <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
        {labels.map((l, i) => (
          <span key={i} className="helper" style={{ width: 16, textAlign: 'center' }}>
            {l.slice(0, 1)}
          </span>
        ))}
      </div>
    </div>
  );
}
