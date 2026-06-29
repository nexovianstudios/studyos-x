import { useEffect, useState } from 'react';

export type Route =
  | 'home' | 'formulas' | 'cheatsheets' | 'focus' | 'ambience'
  | 'effects' | 'mission' | 'analytics' | 'gamification' | 'ai'
  | 'calendar' | 'notes' | 'resources' | 'settings';

export function useRoute(): [Route, (r: Route) => void] {
  const [route, setRoute] = useState<Route>(() => {
    const hash = window.location.hash.slice(1) as Route;
    return hash || 'home';
  });

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash.slice(1) as Route;
      setRoute(hash || 'home');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (r: Route) => {
    window.location.hash = r;
  };

  return [route, navigate];
}

export const NAV_ITEMS: { id: Route; label: string; icon: string }[] = [
  { id: 'home', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'formulas', label: 'Formula Vault', icon: 'Sigma' },
  { id: 'cheatsheets', label: 'Cheat Sheets', icon: 'BookMarked' },
  { id: 'focus', label: 'Focus Zone', icon: 'Timer' },
  { id: 'ambience', label: 'Ambience', icon: 'Music' },
  { id: 'effects', label: 'Immersive FX', icon: 'Sparkles' },
  { id: 'mission', label: 'Mission Control', icon: 'CheckSquare' },
  { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
  { id: 'gamification', label: 'Achievements', icon: 'Trophy' },
  { id: 'ai', label: 'AI Assistant', icon: 'Bot' },
  { id: 'calendar', label: 'Calendar', icon: 'Calendar' },
  { id: 'notes', label: 'Notes Hub', icon: 'StickyNote' },
  { id: 'resources', label: 'Resources', icon: 'Globe' },
  { id: 'settings', label: 'Settings', icon: 'Settings' },
];
