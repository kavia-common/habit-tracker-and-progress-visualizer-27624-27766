# Habit Tracker Frontend (Ocean Professional)

A modern, responsive React app to create, track, and visualize daily habits. Data is stored in localStorage (no backend required).

## Features
- Create, edit, delete habits
- Mark today's completion per habit
- Dashboard with weekly progress, daily totals chart, and motivational message
- Streaks computed from history
- Responsive layout with sidebar navigation
- Ocean Professional theme (Primary #2563EB, Secondary #F59E0B)
- Accessible modals and inputs; keyboard and focus support
- In-memory store with localStorage persistence and seed data

## Quick Start
1. Install dependencies:
   npm install
2. Start development server:
   npm start
3. Open http://localhost:3000

## Project Structure
- src/styles/theme.css — theme tokens and global component styles
- src/context/HabitsContext.jsx — global state, reducer, actions, persistence
- src/utils — date, storage, metrics utilities
- src/components — UI elements (Sidebar, Header, HabitList, HabitItem, HabitModal, ProgressCard, StreakBadge, Charts)
- src/pages — Dashboard and Habits routes
- src/App.jsx — Router and layout shell

## Data Model
Habit:
{ id, name, description, color, targetPerWeek, createdAt, streak, history: { [YYYY-MM-DD]: boolean } }

Actions:
- ADD_HABIT
- UPDATE_HABIT
- DELETE_HABIT
- TOGGLE_COMPLETE(date, habitId)
- RECOMPUTE_STREAKS

## Accessibility
- Labels on all inputs
- Modal supports Escape to close and initial focus
- Buttons include aria-labels

## Notes
- No external services or environment variables required
- Chart is implemented with simple div bars (no heavy libraries)
