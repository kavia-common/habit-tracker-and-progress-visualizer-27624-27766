import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Sidebar Navigation">
      <div className="brand" aria-label="Brand">
        <div className="brand-badge">HT</div>
        <div>
          <div style={{ fontWeight: 800 }}>Habit Tracker</div>
          <div className="muted">Ocean Professional</div>
        </div>
      </div>
      <nav className="nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''} aria-label="Dashboard">
          <span>🏠</span> <span>Dashboard</span>
        </NavLink>
        <NavLink to="/habits" className={({ isActive }) => isActive ? 'active' : ''} aria-label="Habits">
          <span>✅</span> <span>Habits</span>
        </NavLink>
        <NavLink to="/cover" className={({ isActive }) => isActive ? 'active' : ''} aria-label="Cover">
          <span>🎨</span> <span>Cover</span>
        </NavLink>
      </nav>
    </aside>
  );
}
