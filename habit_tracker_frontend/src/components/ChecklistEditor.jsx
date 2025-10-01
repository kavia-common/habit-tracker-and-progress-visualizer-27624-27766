import React, { useState } from 'react';
import { useHabits } from '../context/HabitsContext';

/**
 * PUBLIC_INTERFACE
 * ChecklistEditor renders sub-tasks for a habit and allows toggling/add/remove.
 */
export default function ChecklistEditor({ habitId }) {
  const { habits, toggleChecklistItem, addChecklistItem, removeChecklistItem } = useHabits();
  const habit = habits.find(h => h.id === habitId);
  const [title, setTitle] = useState('');
  if (!habit) return null;
  return (
    <div className="grid" style={{ gap: 8 }}>
      {(habit.checklist || []).map(item => (
        <div key={item.id} className="row" style={{ justifyContent: 'space-between', border: '1px solid var(--border)', borderRadius: 8, padding: 8, background: 'var(--surface)' }}>
          <label className="row" style={{ cursor: 'pointer' }}>
            <input type="checkbox" checked={!!item.done} onChange={() => toggleChecklistItem(habitId, item.id)} />
            <span>{item.title}</span>
          </label>
          <button className="btn ghost" onClick={() => removeChecklistItem(habitId, item.id)} aria-label={`Remove ${item.title}`}>Remove</button>
        </div>
      ))}
      <div className="row">
        <input className="input" placeholder="Add checklist item" value={title} onChange={e => setTitle(e.target.value)} />
        <button className="btn" onClick={() => { if (title.trim()) { addChecklistItem(habitId, title.trim()); setTitle(''); } }}>Add</button>
      </div>
    </div>
  );
}
