import { useEffect, useState } from 'react';
import { StoreProvider } from './store';
import { useRoute } from './router';
import AppShell from './components/AppShell';
import HomePage from './pages/Home';
import FormulaVault from './pages/FormulaVault';
import CheatSheets from './pages/CheatSheets';
import FocusZone from './pages/FocusZone';
import Ambience from './pages/Ambience';
import ImmersiveEffects from './pages/ImmersiveEffects';
import MissionControl from './pages/MissionControl';
import Analytics from './pages/Analytics';
import Gamification from './pages/Gamification';
import AIAssistant from './pages/AIAssistant';
import CalendarCenter from './pages/CalendarCenter';
import NotesHub from './pages/NotesHub';
import ResourceHub from './pages/ResourceHub';
import Settings from './pages/Settings';

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-base-0 flex flex-col items-center justify-center z-[100]">
      <div className="loader-orbit mb-6" />
      <div className="font-display text-2xl font-bold gradient-text mb-2">StudyOS X</div>
      <div className="text-xs text-muted-c uppercase tracking-widest">Class 10 Ultimate Edition</div>
    </div>
  );
}

function AppContent() {
  const [route, navigate] = useRoute();

  const pages: Record<string, React.ReactNode> = {
    home: <HomePage navigate={navigate} />,
    formulas: <FormulaVault />,
    cheatsheets: <CheatSheets />,
    focus: <FocusZone />,
    ambience: <Ambience />,
    effects: <ImmersiveEffects />,
    mission: <MissionControl />,
    analytics: <Analytics />,
    gamification: <Gamification />,
    ai: <AIAssistant />,
    calendar: <CalendarCenter />,
    notes: <NotesHub />,
    resources: <ResourceHub />,
    settings: <Settings />,
  };

  return (
    <AppShell route={route} navigate={navigate}>
      <div key={route} className="animate-fade-in">
        {pages[route] || <HomePage navigate={navigate} />}
      </div>
    </AppShell>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <StoreProvider>
      {loading && <LoadingScreen />}
      <AppContent />
    </StoreProvider>
  );
}
