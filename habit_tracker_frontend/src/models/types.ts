export type ScheduleType = 'daily' | 'weekly' | 'times_per_week';
export interface ChecklistItem { id: string; title: string; done: boolean; }
export interface HabitTemplate { id: string; name: string; description?: string; schedule: { type: ScheduleType; daysOfWeek?: number[]; timesPerWeek?: number; }; defaultChecklist?: string[]; }
export interface Habit { id: string; name: string; color?: string; icon?: string; schedule: { type: ScheduleType; daysOfWeek?: number[]; timesPerWeek?: number; }; checklist: ChecklistItem[]; streak: number; longestStreak: number; lastCheckIn?: string; vacationDates: string[]; // ISO dates
 createdAt: string; updatedAt: string; }
export interface AppSettings { vacationMode: boolean; vacationDates: string[]; }
