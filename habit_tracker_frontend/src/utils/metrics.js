import { getWeekRange } from './date';

// PUBLIC_INTERFACE
export function computeWeeklyCompletion(habits, date = new Date()) {
  const { days } = getWeekRange(date);
  const totals = habits.map(h => {
    const history = h.history || {};
    const count = days.reduce((acc, d) => acc + (history[d] ? 1 : 0), 0);
    return { id: h.id, count, target: h.targetPerWeek || 7 };
  });
  const sumCompleted = totals.reduce((a, x) => a + x.count, 0);
  const sumTargets = totals.reduce((a, x) => a + x.target, 0);
  const percent = sumTargets > 0 ? Math.round((sumCompleted / sumTargets) * 100) : 0;
  return { totals, percent, days };
}

// PUBLIC_INTERFACE
export function motivationalMessage(streakBest, todayCompleted, totalHabits) {
  if (streakBest >= 7) return 'Phenomenal consistency! Keep your streak blazing!';
  if (streakBest >= 3) return 'Great momentum—your habits are sticking!';
  if (todayCompleted >= totalHabits && totalHabits > 0) return 'All done for today. Stellar work!';
  if (todayCompleted > 0) return 'Nice start—every check builds momentum!';
  return 'Begin with one small win today.';
}
