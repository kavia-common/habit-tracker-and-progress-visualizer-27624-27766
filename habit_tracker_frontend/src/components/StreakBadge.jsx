import React from 'react';

export default function StreakBadge({ count = 0 }) {
  return (
    <div className="badge" aria-label={`Streak ${count} days`}>
      🔥 {count}d
    </div>
  );
}
