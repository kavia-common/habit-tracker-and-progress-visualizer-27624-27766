import React, { useMemo, useState } from 'react';
import HabitItem from './HabitItem';
import HabitModal from './HabitModal';
import { useHabits } from '../context/HabitsContext';

export default function HabitList({ showHeader = true }) {
  const { habits } = useHabits();
  const [filter, setFilter] = useState('active');
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    if (filter === 'all') return habits;
    return habits.filter(h => true); // "active" placeholder – all habits are active in MVP
  }, [habits, filter]);

  const onAdd = () => { setEditing(null); setOpen(true); };
  const onEdit = (habit) => { setEditing(habit); setOpen(true); };

  return (
    <div className="card">
      {showHeader && (
        <div className="card-title">
          <h3 style={{ margin: 0 }}>Habits</h3>
          <div className="row">
            <select
              aria-label="Filter habits"
              className="select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="all">All</option>
            </select>
            <button className="btn" onClick={onAdd} aria-haspopup="dialog" aria-controls="habit-modal">+ Add</button>
          </div>
        </div>
      )}
      <div className="grid" style={{ gap: 12 }}>
        {filtered.map(h => (
          <HabitItem key={h.id} habit={h} onEdit={() => onEdit(h)} />
        ))}
        {filtered.length === 0 && (
          <div className="helper">No habits yet. Click Add to create your first habit.</div>
        )}
      </div>
      {open && (
        <HabitModal
          habit={editing}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
