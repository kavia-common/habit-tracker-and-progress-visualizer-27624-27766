import React, { useState } from 'react';
import { useHabits } from '../context/HabitsContext';

/**
 * PUBLIC_INTERFACE
 * VacationSettings toggles global vacation mode and manages vacation dates.
 */
export default function VacationSettings() {
  const { settings, toggleVacationMode, setVacationDates } = useHabits();
  const [dateInput, setDateInput] = useState('');

  const addDate = () => {
    const d = dateInput.trim();
    if (/^\\d{4}-\\d{2}-\\d{2}$/.test(d)) {
      const next = Array.from(new Set([...(settings.vacationDates || []), d]));
      setVacationDates(next);
      setDateInput('');
    }
  };
  const removeDate = (d) => {
    setVacationDates((settings.vacationDates || []).filter(x => x !== d));
  };

  return (
    <div className="card">
      <div className="card-title">
        <div>
          <div style={{ fontWeight: 700 }}>Vacation Mode</div>
          <div className="helper">Preserve streaks on selected dates</div>
        </div>
        <label className="row">
          <span className="helper">Enabled</span>
          <input type="checkbox" checked={!!settings.vacationMode} onChange={e => toggleVacationMode(e.target.checked)} aria-label="Toggle vacation mode" />
        </label>
      </div>
      <div className="row" style={{ alignItems: 'stretch' }}>
        <input className="input" placeholder="YYYY-MM-DD" value={dateInput} onChange={e => setDateInput(e.target.value)} aria-label="Add vacation date" />
        <button className="btn" onClick={addDate}>Add</button>
      </div>
      <div className="row" style={{ flexWrap: 'wrap', marginTop: 8 }}>
        {(settings.vacationDates || []).map(d => (
          <span key={d} className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 6, marginBottom: 6 }}>
            {d}
            <button className="btn ghost" onClick={() => removeDate(d)} aria-label={`Remove ${d}`}>✕</button>
          </span>
        ))}
      </div>
    </div>
  );
}
