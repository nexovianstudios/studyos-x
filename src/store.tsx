import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';

export type Theme = 'brabus-black' | 'cyber-blue' | 'matrix-green' | 'midnight-purple' | 'arctic-white';
export type EffectMode = 'none' | 'rain' | 'snow' | 'galaxy' | 'matrix' | 'particle' | 'cyberpunk' | 'minimal';

export interface UserState {
  name: string;
  xp: number;
  coins: number;
  level: number;
  streak: number;
  lastStudyDate: string | null;
  focusScore: number;
  achievements: string[];
  favorites: string[];
  bookmarks: string[];
  notes: Note[];
  goals: Goal[];
  sessions: StudySession[];
  heatmap: Record<string, number>;
  subjectProgress: Record<string, number>;
  dailyGoals: DailyGoal[];
  events: CalendarEvent[];
  preferences: Preferences;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

export interface Goal {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'subject' | 'chapter';
  priority: 'low' | 'medium' | 'high';
  done: boolean;
  dueDate?: string;
  notes?: string;
  subject?: string;
  order: number;
}

export interface DailyGoal {
  id: string;
  title: string;
  done: boolean;
  date: string;
}

export interface StudySession {
  id: string;
  subject: string;
  mode: string;
  duration: number;
  date: string;
  focusScore: number;
  notes?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'exam' | 'homework' | 'revision' | 'study' | 'custom';
  subject?: string;
}

export interface Preferences {
  theme: Theme;
  accent: string;
  effectMode: EffectMode;
  font: string;
  pomodoroWork: number;
  pomodoroBreak: number;
  notifications: boolean;
  soundEnabled: boolean;
}

const DEFAULT_STATE: UserState = {
  name: 'Student',
  xp: 0,
  coins: 0,
  level: 1,
  streak: 0,
  lastStudyDate: null,
  focusScore: 0,
  achievements: [],
  favorites: [],
  bookmarks: [],
  notes: [],
  goals: [],
  sessions: [],
  heatmap: {},
  subjectProgress: {},
  dailyGoals: [],
  events: [],
  preferences: {
    theme: 'brabus-black',
    accent: '#00d4ff',
    effectMode: 'particle',
    font: 'Inter',
    pomodoroWork: 25,
    pomodoroBreak: 5,
    notifications: true,
    soundEnabled: true,
  },
};

const STORAGE_KEY = 'studyos-x-state-v1';

function loadState(): UserState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed, preferences: { ...DEFAULT_STATE.preferences, ...parsed.preferences } };
  } catch {
    return DEFAULT_STATE;
  }
}

const XP_PER_LEVEL = 500;

function levelFromXp(xp: number) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

interface StoreContextType {
  state: UserState;
  setState: (updater: (s: UserState) => UserState) => void;
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  unlockAchievement: (id: string) => void;
  toggleFavorite: (id: string) => void;
  toggleBookmark: (id: string) => void;
  recordSession: (session: Omit<StudySession, 'id' | 'date'>) => void;
  updatePreferences: (p: Partial<Preferences>) => void;
  resetData: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<UserState>(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full or unavailable
    }
  }, [state]);

  // Apply theme to document
  useEffect(() => {
    const theme = state.preferences.theme;
    const root = document.documentElement;
    if (theme === 'brabus-black') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
  }, [state.preferences.theme]);

  const setState = useCallback((updater: (s: UserState) => UserState) => {
    setStateRaw((prev) => updater(prev));
  }, []);

  const addXp = useCallback((amount: number) => {
    setStateRaw((prev) => {
      const newXp = prev.xp + amount;
      const newLevel = levelFromXp(newXp);
      return { ...prev, xp: newXp, level: newLevel, coins: prev.coins + Math.floor(amount / 10) };
    });
  }, []);

  const addCoins = useCallback((amount: number) => {
    setStateRaw((prev) => ({ ...prev, coins: prev.coins + amount }));
  }, []);

  const unlockAchievement = useCallback((id: string) => {
    setStateRaw((prev) => {
      if (prev.achievements.includes(id)) return prev;
      return { ...prev, achievements: [...prev.achievements, id], coins: prev.coins + 50 };
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setStateRaw((prev) => ({
      ...prev,
      favorites: prev.favorites.includes(id)
        ? prev.favorites.filter((f) => f !== id)
        : [...prev.favorites, id],
    }));
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setStateRaw((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.includes(id)
        ? prev.bookmarks.filter((b) => b !== id)
        : [...prev.bookmarks, id],
    }));
  }, []);

  const recordSession = useCallback((session: Omit<StudySession, 'id' | 'date'>) => {
    setStateRaw((prev) => {
      const today = new Date().toISOString().slice(0, 10);
      const newSession: StudySession = {
        ...session,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
      };
      const heatmap = { ...prev.heatmap, [today]: (prev.heatmap[today] || 0) + session.duration };
      // streak logic
      let streak = prev.streak;
      const last = prev.lastStudyDate;
      if (last !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        streak = last === yesterday ? streak + 1 : 1;
      }
      const subjectProgress = { ...prev.subjectProgress };
      if (session.subject) {
        subjectProgress[session.subject] = (subjectProgress[session.subject] || 0) + session.duration / 60;
      }
      return {
        ...prev,
        sessions: [...prev.sessions, newSession],
        heatmap,
        streak,
        lastStudyDate: today,
        focusScore: Math.min(100, prev.focusScore + Math.floor(session.duration / 60)),
        subjectProgress,
      };
    });
  }, []);

  const updatePreferences = useCallback((p: Partial<Preferences>) => {
    setStateRaw((prev) => ({ ...prev, preferences: { ...prev.preferences, ...p } }));
  }, []);

  const resetData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setStateRaw(DEFAULT_STATE);
  }, []);

  return (
    <StoreContext.Provider
      value={{ state, setState, addXp, addCoins, unlockAchievement, toggleFavorite, toggleBookmark, recordSession, updatePreferences, resetData }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export { XP_PER_LEVEL, levelFromXp };
