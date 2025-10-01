import React from 'react';
import { useHabits } from '../context/HabitsContext';

/**
 * PUBLIC_INTERFACE
 * TemplatePicker lists predefined templates to quickly add a habit.
 */
export default function TemplatePicker({ onPicked }) {
  const { templates, addHabitFromTemplate } = useHabits();
  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
      {templates.map(t => (
        <button
          key={t.id}
          onClick={() => { addHabitFromTemplate(t.id); onPicked && onPicked(); }}
          className="card"
          style={{ textAlign: 'left', cursor: 'pointer' }}
          aria-label={`Use ${t.name} template`}
        >
          <div style={{ fontWeight: 700 }}>{t.name}</div>
          {t.description && <div className="helper">{t.description}</div>}
          <div className="helper" style={{ marginTop: 8, color: 'var(--primary)' }}>Use template</div>
        </button>
      ))}
    </div>
  );
}
