import React, { useEffect, useRef, useState } from 'react';
import { useHabits } from '../context/HabitsContext';
import TemplatePicker from './TemplatePicker';

/**
 * PUBLIC_INTERFACE
 * HabitModal creates/edits a habit with schedule controls and template quick-pick.
 */
export default function HabitModal({ habit, onClose }) {
  const isEdit = !!habit;
  const { addHabit, updateHabit } = useHabits();
  const [name, setName] = useState(habit?.name || '');
  const [description, setDescription] = useState(habit?.description || '');
  const [color, setColor] = useState(habit?.color || '#2563EB');

  // Schedule UI
  const [scheduleType, setScheduleType] = useState(habit?.schedule?.type || 'daily');
  const [timesPerWeek, setTimesPerWeek] = useState(habit?.schedule?.type === 'times_per_week' ? (habit?.schedule?.timesPerWeek || 3) : 3);
  const [daysOfWeek, setDaysOfWeek] = useState(habit?.schedule?.daysOfWeek || [1,2,3,4,5]);

  const firstFieldRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    firstFieldRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onSubmit = (e) => {
    e.preventDefault();
    const schedule =
      scheduleType === 'daily' ? { type: 'daily' } :
      scheduleType === 'weekly' ? { type: 'weekly', daysOfWeek } :
      { type: 'times_per_week', timesPerWeek: Math.max(1, Math.min(7, Number(timesPerWeek) || 3)) };

    const payload = { name, description, color, schedule, checklist: habit?.checklist || [] };
    if (!name.trim()) return;
    if (isEdit) updateHabit(habit.id, payload);
    else addHabit(payload);
    onClose();
  };

  const toggleDay = (d) => {
    setScheduleType('weekly');
    setDaysOfWeek(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="habit-modal-title" id="habit-modal">
      <div className="modal" ref={dialogRef}>
        <div className="card-title">
          <h3 id="habit-modal-title" style={{ margin: 0 }}>{isEdit ? 'Edit Habit' : 'Create Habit'}</h3>
          <button className="btn ghost" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {!isEdit && (
          <div className="grid" style={{ marginBottom: 12 }}>
            <div className="helper" style={{ fontWeight: 600 }}>Quick start with a template</div>
            <TemplatePicker onPicked={onClose} />
            <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="grid">
            <label>
              <div className="helper">Name</div>
              <input
                ref={firstFieldRef}
                className="input"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                aria-required="true"
                placeholder="e.g., Read 20 minutes"
              />
            </label>
            <label>
              <div className="helper">Description</div>
              <textarea
                className="textarea"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </label>

            <div className="grid cols-3">
              <label className="card" style={{ cursor: 'pointer' }}>
                <input type="radio" name="schedule" checked={scheduleType === 'daily'} onChange={() => setScheduleType('daily')} />
                <span style={{ marginLeft: 6, fontWeight: 600 }}>Daily</span>
              </label>

              <label className="card" style={{ cursor: 'pointer' }}>
                <input type="radio" name="schedule" checked={scheduleType === 'weekly'} onChange={() => setScheduleType('weekly')} />
                <span style={{ marginLeft: 6, fontWeight: 600 }}>Weekly</span>
                <div className="row" style={{ marginTop: 8, flexWrap: 'wrap' }}>
                  {[0,1,2,3,4,5,6].map(d => (
                    <button key={d} type="button" className="btn ghost" onClick={() => toggleDay(d)} style={{ padding: '6px 8px', borderRadius: 8, borderColor: daysOfWeek.includes(d) ? 'var(--primary)' : 'var(--border)', color: daysOfWeek.includes(d) ? 'var(--primary)' : 'inherit' }}>
                      {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]}
                    </button>
                  ))}
                </div>
              </label>

              <label className="card" style={{ cursor: 'pointer' }}>
                <input type="radio" name="schedule" checked={scheduleType === 'times_per_week'} onChange={() => setScheduleType('times_per_week')} />
                <span style={{ marginLeft: 6, fontWeight: 600 }}>Times per week</span>
                <input type="number" min={1} max={7} className="input" style={{ width: 90, marginTop: 8 }} value={timesPerWeek} onChange={e => setTimesPerWeek(Number(e.target.value) || 3)} />
              </label>
            </div>

            <label style={{ width: 160 }}>
              <div className="helper">Accent color</div>
              <input
                type="color"
                className="input"
                value={color}
                onChange={e => setColor(e.target.value)}
                aria-label="Habit color"
              />
            </label>
          </div>
          <div className="space-between" style={{ marginTop: 16 }}>
            <div />
            <div className="row">
              <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn">{isEdit ? 'Save' : 'Create'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
