import React from 'react';
import HabitList from '../components/HabitList';
import VacationSettings from '../components/VacationSettings';

export default function Habits() {
  return (
    <div className="grid">
      <HabitList showHeader />
      <VacationSettings />
    </div>
  );
}
