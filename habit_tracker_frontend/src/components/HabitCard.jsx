import React from 'react';
import { useHabits } from '../context/HabitsContext';
import ChecklistEditor from './ChecklistEditor';

/**
 * PUBLIC_INTERFACE
 * HabitCard shows a habit summary with streaks and a checklist editor.
 */
export default function HabitCard({ id }) {
  const { habits, deleteHabit, checkIn } = useHabits();
  const habit = habits.find(h => h.id === id);
  if (!habit) return null;
  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <div style={{ fontWeight: 700 }}>{habit.name}</div>
          <div className="helper">Streak: <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{habit.streak || 0}</span> • Longest: {habit.longestStreak || 0}</div>
        </div>
        <div className="row">
          <button className="btn secondary" onClick={() => checkIn(habit.id)}>Check-in</button>
          <button className="btn ghost" onClick={() => deleteHabit(habit.id)}>Delete</button>
        </div>
      </div>
      <ChecklistEditor habitId={habit.id} />
    </div>
  );
}
