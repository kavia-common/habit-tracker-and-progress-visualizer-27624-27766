import React from 'react';
import { getISODate } from '../utils/date';

export default function Header() {
  const today = new Date();
  const nice = today.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  return (
    <header className="header">
      <h1>Welcome back</h1>
      <div className="helper">Today: {nice} • {getISODate(today)}</div>
    </header>
  );
}
