import { getISODate } from './date';

/**
 * PUBLIC_INTERFACE
 * isDateIn checks whether ISO date exists in a list.
 */
export function isDateIn(dateISO, list) {
  return Array.isArray(list) && list.includes(dateISO);
}

function isVacation(dateISO, habit, settings) {
  return ((settings?.vacationMode && isDateIn(dateISO, settings?.vacationDates || [])) ||
          isDateIn(dateISO, habit?.vacationDates || []));
}

/**
 * PUBLIC_INTERFACE
 * calculateStreak: simplified streak logic honoring vacation days.
 * We don't persist full per-day completion; we approximate based on lastCheckIn and completion flag.
 * - If completed today and lastCheckIn wasn't today, increment.
 * - If missed today but it's vacation, preserve streak.
 * - Else reset streak.
 * Returns: { streak, longest }
 */
export function calculateStreak(habit, settings, dateISO, completedToday = true) {
  const today = dateISO || getISODate(new Date());
  let streak = Number(habit?.streak || 0);
  let longest = Number(habit?.longestStreak || 0);

  if (completedToday) {
    if (habit?.lastCheckIn !== today) streak += 1;
  } else {
    if (!isVacation(today, habit, settings)) {
      streak = 0;
    }
  }
  if (streak > longest) longest = streak;
  return { streak, longest };
}
