import React, { useMemo } from 'react';
import { useHabits } from '../context/HabitsContext';
import ProgressCard from '../components/ProgressCard';
import WeeklyBarChart from '../components/Charts/WeeklyBarChart';
import { computeWeeklyCompletion, motivationalMessage } from '../utils/metrics';
import { getISODate, getWeekRange } from '../utils/date';
import HabitList from '../components/HabitList';

export default function Dashboard() {
  const { habits } = useHabits();
  const weekly = useMemo(() => computeWeeklyCompletion(habits, new Date()), [habits]);

  const today = getISODate(new Date());
  const todayCompleted = habits.reduce((acc, h) => acc + (h.history?.[today] ? 1 : 0), 0);
  const streakBest = habits.reduce((acc, h) => Math.max(acc, h.streak || 0), 0);

  const message = motivationalMessage(streakBest, todayCompleted, habits.length);

  // Chart: total completions per day across all habits this week
  const { days } = getWeekRange(new Date());
  const dayLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const dailyTotals = days.map(d => habits.reduce((acc, h) => acc + (h.history?.[d] ? 1 : 0), 0));

  return (
    <div className="grid">
      <div className="grid cols-3">
        <ProgressCard title="Weekly Progress" percent={weekly.percent} helper="Completion vs weekly targets" />
        <div className="card">
          <div className="card-title">
            <h4 style={{ margin: 0 }}>Today</h4>
          </div>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{todayCompleted}</div>
              <div className="helper">Completed today</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{habits.length}</div>
              <div className="helper">Total habits</div>
            </div>
          </div>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.08), #fff)' }}>
          <div className="card-title">
            <h4 style={{ margin: 0 }}>Motivation</h4>
          </div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{message}</div>
          <div className="helper" style={{ marginTop: 6 }}>Best streak: {streakBest} days</div>
        </div>
      </div>

      <WeeklyBarChart data={dailyTotals} labels={dayLabels} />

      <HabitList showHeader />
    </div>
  );
}
