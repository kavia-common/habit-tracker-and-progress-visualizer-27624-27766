import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { safeLoad, safeSave } from '../utils/storage';
import { getISODate, computeStreak } from '../utils/date';
import { v4 as uuidv4 } from './uuid-lite';

// Minimal UUID replacement to avoid extra deps if import fails
function fallbackUUID() {
  try { return crypto.randomUUID(); } catch { /* noop */ }
  // simple fallback
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
const genId = typeof uuidv4 === 'function' ? uuidv4 : fallbackUUID;

const STORAGE_KEY = 'habit_tracker_state_v1';

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

const initialState = {
  habits: [],
  hydrated: false,
};

function withComputed(habits) {
  // recompute streaks for each habit using its history
  return habits.map(h => {
    const streak = computeStreak(h.history || {});
    return { ...h, streak };
  });
}

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE': {
      const habits = withComputed(action.payload.habits || []);
      return { ...state, habits, hydrated: true };
    }
    case 'ADD_HABIT': {
      const now = new Date();
      const newHabit = {
        id: genId(),
        name: action.payload.name.trim(),
        description: action.payload.description?.trim() || '',
        color: action.payload.color || '#2563EB',
        targetPerWeek: Math.min(7, Math.max(1, Number(action.payload.targetPerWeek || 3))),
        createdAt: now.toISOString(),
        streak: 0,
        history: {},
      };
      return { ...state, habits: withComputed([newHabit, ...state.habits]) };
    }
    case 'UPDATE_HABIT': {
      const { id, data } = action.payload;
      const habits = state.habits.map(h => h.id === id ? withComputed([ { ...h, ...data } ])[0] : h);
      return { ...state, habits };
    }
    case 'DELETE_HABIT': {
      return { ...state, habits: state.habits.filter(h => h.id !== action.payload.id) };
    }
    case 'TOGGLE_COMPLETE': {
      const { id, date } = action.payload;
      const habits = state.habits.map(h => {
        if (h.id !== id) return h;
        const d = date || getISODate(new Date());
        const history = { ...(h.history || {}) };
        history[d] = !history[d];
        return { ...h, history };
      });
      return { ...state, habits: withComputed(habits) };
    }
    case 'RECOMPUTE_STREAKS': {
      return { ...state, habits: withComputed(state.habits) };
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
      dispatch({ type: 'HYDRATE', payload: { habits: data.habits } });
    } else {
      // seed data first time
      const today = getISODate(new Date());
      const seed = [
        {
          id: genId(),
          name: 'Morning Run',
          description: '20 minutes light jog',
          color: '#2563EB',
          targetPerWeek: 4,
          createdAt: new Date().toISOString(),
          streak: 0,
          history: { [today]: false },
        },
        {
          id: genId(),
          name: 'Read 10 pages',
          description: 'Non-fiction preferred',
          color: '#F59E0B',
          targetPerWeek: 5,
          createdAt: new Date().toISOString(),
          streak: 0,
          history: { [today]: true },
        },
        {
          id: genId(),
          name: 'Meditate',
          description: '5 minutes mindfulness',
          color: '#10B981',
          targetPerWeek: 7,
          createdAt: new Date().toISOString(),
          streak: 0,
          history: {},
        },
      ];
      dispatch({ type: 'HYDRATE', payload: { habits: seed } });
    }
  }, []);

  // persist on state change (skip first pre-hydration render)
  useEffect(() => {
    if (!state.hydrated) return;
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    safeSave(STORAGE_KEY, { habits: state.habits });
  }, [state.habits, state.hydrated]);

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
    recomputeStreaks: () => dispatch({ type: 'RECOMPUTE_STREAKS' }),
  }), []);

  return (
    <HabitsContext.Provider value={{ ...state, ...actions }}>
      {children}
    </HabitsContext.Provider>
  );
}
