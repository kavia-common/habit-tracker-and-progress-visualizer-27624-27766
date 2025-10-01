import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { safeLoad, safeSave } from '../utils/storage';
import { getISODate, computeStreak } from '../utils/date';
import { v4 as uuidv4 } from './uuid-lite';
import { calculateStreak } from '../utils/streak';

// Minimal UUID replacement to avoid extra deps if import fails
function fallbackUUID() {
  try { return crypto.randomUUID(); } catch { /* noop */ }
  // simple fallback
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
const genId = typeof uuidv4 === 'function' ? uuidv4 : fallbackUUID;

const STORAGE_KEY = 'habit_tracker_state_v2'; // bump key for new data model with checklist/settings

// PUBLIC_INTERFACE
export const HabitsContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * useHabits provides access to global habits state and actions
 */
export function useHabits() {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error('useHabits must be used within HabitsProvider');
  return ctx;
}

const defaultTemplates = [
  { id: 'reading', name: 'Reading', description: '20 minutes daily', schedule: { type: 'daily' }, defaultChecklist: ['Read 10 pages', 'Summarize key idea'] },
  { id: 'workout', name: 'Workout', description: '3x per week', schedule: { type: 'times_per_week', timesPerWeek: 3 }, defaultChecklist: ['Warm-up', 'Main set', 'Stretch'] },
  { id: 'meditation', name: 'Meditation', description: 'Weekdays only', schedule: { type: 'weekly', daysOfWeek: [1,2,3,4,5] }, defaultChecklist: ['5-min breathing', 'Gratitude note'] }
];

const initialState = {
  habits: [],
  hydrated: false,
  templates: defaultTemplates,
  settings: { vacationMode: false, vacationDates: [] },
};

function withComputed(habits) {
  // recompute streaks for each habit using its history if present (legacy)
  return habits.map(h => {
    const streak = computeStreak(h.history || {});
    const longestStreak = Math.max(h.longestStreak || 0, streak);
    return { checklist: [], vacationDates: [], schedule: { type: 'daily' }, ...h, streak, longestStreak };
  });
}

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE': {
      const habits = withComputed(action.payload.habits || []);
      const settings = action.payload.settings || initialState.settings;
      const templates = action.payload.templates || state.templates;
      return { ...state, habits, templates, settings, hydrated: true };
    }
    case 'ADD_FROM_TEMPLATE': {
      const t = state.templates.find(x => x.id === action.payload.templateId);
      if (!t) return state;
      const now = new Date().toISOString();
      const newHabit = {
        id: genId(),
        name: action.payload.name?.trim() || t.name,
        schedule: t.schedule,
        checklist: (t.defaultChecklist || []).map(title => ({ id: genId(), title, done: false })),
        color: action.payload.color,
        icon: action.payload.icon,
        streak: 0,
        longestStreak: 0,
        lastCheckIn: undefined,
        vacationDates: [],
        createdAt: now,
        updatedAt: now,
      };
      return { ...state, habits: [newHabit, ...state.habits] };
    }
    case 'ADD_HABIT': {
      const now = new Date().toISOString();
      const schedule = action.payload.schedule || { type: 'daily' };
      const newHabit = {
        id: genId(),
        name: action.payload.name.trim(),
        description: action.payload.description?.trim() || '',
        color: action.payload.color || '#2563EB',
        schedule,
        checklist: action.payload.checklist || [],
        streak: 0,
        longestStreak: 0,
        lastCheckIn: undefined,
        vacationDates: [],
        createdAt: now,
        updatedAt: now,
      };
      return { ...state, habits: [newHabit, ...state.habits] };
    }
    case 'UPDATE_HABIT': {
      const { id, data } = action.payload;
      const habits = state.habits.map(h => h.id === id ? { ...h, ...data, updatedAt: new Date().toISOString() } : h);
      return { ...state, habits };
    }
    case 'DELETE_HABIT': {
      return { ...state, habits: state.habits.filter(h => h.id !== action.payload.id) };
    }
    case 'TOGGLE_CHECKLIST': {
      const { habitId, itemId, dateISO } = action.payload;
      const d = dateISO || getISODate(new Date());
      const habits = state.habits.map(h => {
        if (h.id !== habitId) return h;
        const checklist = (h.checklist || []).map(ci => ci.id === itemId ? { ...ci, done: !ci.done } : ci);
        const allDone = checklist.length ? checklist.every(ci => ci.done) : true;
        const { streak, longest } = calculateStreak(h, state.settings, d, allDone);
        return { ...h, checklist, streak, longestStreak: Math.max(h.longestStreak || 0, longest), lastCheckIn: d, updatedAt: new Date().toISOString() };
      });
      return { ...state, habits };
    }
    case 'ADD_CHECKLIST_ITEM': {
      const { habitId, title } = action.payload;
      const habits = state.habits.map(h => h.id === habitId ? { ...h, checklist: [...(h.checklist || []), { id: genId(), title, done: false }] } : h);
      return { ...state, habits };
    }
    case 'REMOVE_CHECKLIST_ITEM': {
      const { habitId, itemId } = action.payload;
      const habits = state.habits.map(h => h.id === habitId ? { ...h, checklist: (h.checklist || []).filter(ci => ci.id !== itemId) } : h);
      return { ...state, habits };
    }
    case 'CHECK_IN': {
      const { habitId, dateISO } = action.payload;
      const d = dateISO || getISODate(new Date());
      const habits = state.habits.map(h => {
        if (h.id !== habitId) return h;
        const allDone = h.checklist?.length ? h.checklist.every(ci => ci.done) : true;
        const { streak, longest } = calculateStreak(h, state.settings, d, allDone);
        return { ...h, streak, longestStreak: Math.max(h.longestStreak || 0, longest), lastCheckIn: d, updatedAt: new Date().toISOString() };
      });
      return { ...state, habits };
    }
    case 'SET_VACATION_DATES': {
      return { ...state, settings: { ...state.settings, vacationDates: action.payload.dates } };
    }
    case 'TOGGLE_VACATION_MODE': {
      return { ...state, settings: { ...state.settings, vacationMode: !!action.payload.enabled } };
    }
    // Legacy actions retained for compatibility with Dashboard/metrics that reference history/targetPerWeek
    case 'TOGGLE_COMPLETE': {
      const { id, date } = action.payload;
      const habits = state.habits.map(h => {
        if (h.id !== id) return h;
        const d = date || getISODate(new Date());
        const history = { ...(h.history || {}) };
        history[d] = !history[d];
        const streak = computeStreak(history);
        const longestStreak = Math.max(h.longestStreak || 0, streak);
        return { ...h, history, streak, longestStreak, lastCheckIn: history[d] ? d : h.lastCheckIn };
      });
      return { ...state, habits };
    }
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function HabitsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isFirst = useRef(true);

  // hydrate on mount
  useEffect(() => {
    const data = safeLoad(STORAGE_KEY);
    if (data && Array.isArray(data.habits)) {
      dispatch({ type: 'HYDRATE', payload: { habits: data.habits, settings: data.settings, templates: data.templates } });
    } else {
      // seed data first time with minimal history for compatibility
      const today = getISODate(new Date());
      const seed = [
        {
          id: genId(),
          name: 'Morning Run',
          description: '20 minutes light jog',
          color: '#2563EB',
          schedule: { type: 'times_per_week', timesPerWeek: 4 },
          createdAt: new Date().toISOString(),
          streak: 0,
          longestStreak: 0,
          history: { [today]: false },
          checklist: [{ id: genId(), title: 'Warm-up', done: false }],
          vacationDates: [],
        },
        {
          id: genId(),
          name: 'Read 10 pages',
          description: 'Non-fiction preferred',
          color: '#F59E0B',
          schedule: { type: 'weekly', daysOfWeek: [1,2,3,4,5] },
          createdAt: new Date().toISOString(),
          streak: 0,
          longestStreak: 0,
          history: { [today]: true },
          checklist: [{ id: genId(), title: 'Take notes', done: false }],
          vacationDates: [],
        },
      ];
      dispatch({ type: 'HYDRATE', payload: { habits: seed, settings: initialState.settings, templates: defaultTemplates } });
    }
  }, []);

  // persist on state change (skip first pre-hydration render)
  useEffect(() => {
    if (!state.hydrated) return;
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    safeSave(STORAGE_KEY, { habits: state.habits, settings: state.settings, templates: state.templates });
  }, [state.habits, state.hydrated, state.settings, state.templates]);

  const actions = useMemo(() => ({
    // PUBLIC_INTERFACE
    addHabit: (data) => dispatch({ type: 'ADD_HABIT', payload: data }),
    // PUBLIC_INTERFACE
    updateHabit: (id, data) => dispatch({ type: 'UPDATE_HABIT', payload: { id, data } }),
    // PUBLIC_INTERFACE
    deleteHabit: (id) => dispatch({ type: 'DELETE_HABIT', payload: { id } }),
    // PUBLIC_INTERFACE
    toggleComplete: (id, date) => dispatch({ type: 'TOGGLE_COMPLETE', payload: { id, date } }),
    // PUBLIC_INTERFACE
    addHabitFromTemplate: (templateId, name) => dispatch({ type: 'ADD_FROM_TEMPLATE', payload: { templateId, name } }),
    // PUBLIC_INTERFACE
    toggleChecklistItem: (habitId, itemId, dateISO) => dispatch({ type: 'TOGGLE_CHECKLIST', payload: { habitId, itemId, dateISO } }),
    // PUBLIC_INTERFACE
    addChecklistItem: (habitId, title) => dispatch({ type: 'ADD_CHECKLIST_ITEM', payload: { habitId, title } }),
    // PUBLIC_INTERFACE
    removeChecklistItem: (habitId, itemId) => dispatch({ type: 'REMOVE_CHECKLIST_ITEM', payload: { habitId, itemId } }),
    // PUBLIC_INTERFACE
    setVacationDates: (dates) => dispatch({ type: 'SET_VACATION_DATES', payload: { dates } }),
    // PUBLIC_INTERFACE
    toggleVacationMode: (enabled) => dispatch({ type: 'TOGGLE_VACATION_MODE', payload: { enabled } }),
    // PUBLIC_INTERFACE
    checkIn: (habitId, dateISO) => dispatch({ type: 'CHECK_IN', payload: { habitId, dateISO } }),
  }), []);

  return (
    <HabitsContext.Provider value={{ ...state, ...actions }}>
      {children}
    </HabitsContext.Provider>
  );
}
