export function pad(n) {
  return n < 10 ? `0${n}` : String(n);
}

// PUBLIC_INTERFACE
export function getISODate(d = new Date()) {
  const dt = new Date(d);
  const yyyy = dt.getFullYear();
  const mm = pad(dt.getMonth() + 1);
  const dd = pad(dt.getDate());
  return `${yyyy}-${mm}-${dd}`;
}

// PUBLIC_INTERFACE
export function getWeekRange(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun..6=Sat
  const diffToMonday = (day + 6) % 7; // Monday=0
  const start = new Date(d);
  start.setDate(d.getDate() - diffToMonday);
  const days = Array.from({ length: 7 }, (_, i) => {
    const curr = new Date(start);
    curr.setDate(start.getDate() + i);
    return getISODate(curr);
  });
  return { start: getISODate(start), days };
}

// PUBLIC_INTERFACE
export function computeStreak(history = {}) {
  // Count consecutive true values from today backwards
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 3650; i += 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = getISODate(d);
    if (history[iso]) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}
