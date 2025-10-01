import React, { useEffect, useRef, useState } from 'react';
import { useHabits } from '../context/HabitsContext';

export default function HabitModal({ habit, onClose }) {
  const isEdit = !!habit;
  const { addHabit, updateHabit } = useHabits();
  const [name, setName] = useState(habit?.name || '');
  const [description, setDescription] = useState(habit?.description || '');
  const [targetPerWeek, setTargetPerWeek] = useState(habit?.targetPerWeek || 3);
  const [color, setColor] = useState(habit?.color || '#2563EB');
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
    const payload = { name, description, targetPerWeek: Number(targetPerWeek), color };
    if (!name.trim()) return;
    if (isEdit) updateHabit(habit.id, payload);
    else addHabit(payload);
    onClose();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="habit-modal-title" id="habit-modal">
      <div className="modal" ref={dialogRef}>
        <div className="card-title">
          <h3 id="habit-modal-title" style={{ margin: 0 }}>{isEdit ? 'Edit Habit' : 'Create Habit'}</h3>
          <button className="btn ghost" onClick={onClose} aria-label="Close">✕</button>
        </div>
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
            <div className="row" style={{ gap: 16 }}>
              <label style={{ flex: 1 }}>
                <div className="helper">Target days / week</div>
                <input
                  type="number"
                  min={1}
                  max={7}
                  className="input"
                  value={targetPerWeek}
                  onChange={e => setTargetPerWeek(e.target.value)}
                />
              </label>
              <label style={{ width: 140 }}>
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
