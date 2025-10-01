import React, { useMemo } from 'react';
import { useHabits } from '../context/HabitsContext';
import { getISODate } from '../utils/date';
import StreakBadge from './StreakBadge';

/**
 * PUBLIC_INTERFACE
 * HabitItem (legacy list row) supports toggle complete and integrates check-in aggregation.
 */
export default function HabitItem({ habit, onEdit }) {
  const { deleteHabit, toggleComplete, checkIn } = useHabits();
  const today = getISODate(new Date());
  const checked = !!(habit.history && habit.history[today]);

  const completionText = useMemo(() => checked ? 'Completed today' : 'Mark complete', [checked]);

  const allChecklistDone = (habit.checklist || []).length ? (habit.checklist || []).every(ci => ci.done) : checked;

  return (
    <div className="habit-item" role="group" aria-label={`Habit ${habit.name}`}>
      <div className="row" style={{ justifyContent: 'flex-start' }}>
        <span className="habit-dot" style={{ background: habit.color || '#2563EB' }} aria-hidden />
        <div>
          <div style={{ fontWeight: 700 }}>{habit.name}</div>
          <div className="helper">{habit.description}</div>
        </div>
      </div>

      <button
        className={`checkbox ${allChecklistDone ? 'checked' : ''}`}
        aria-pressed={allChecklistDone}
        aria-label={completionText}
        onClick={() => { toggleComplete(habit.id, today); checkIn(habit.id, today); }}
        title={completionText}
      >
        {allChecklistDone ? '✓' : ''}
      </button>

      <StreakBadge count={habit.streak || 0} />

      <div className="row">
        <button className="btn ghost" onClick={onEdit} aria-label={`Edit ${habit.name}`}>Edit</button>
        <button className="btn ghost" onClick={() => deleteHabit(habit.id)} aria-label={`Delete ${habit.name}`}>Delete</button>
      </div>
    </div>
  );
}
