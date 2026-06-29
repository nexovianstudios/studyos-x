import { useState, type ReactNode } from 'react';
import * as Icons from 'lucide-react';
import { useStore, XP_PER_LEVEL } from '../store';
import { NAV_ITEMS, type Route } from '../router';
import CustomCursor from './CustomCursor';
import BackgroundEffects from './BackgroundEffects';

const iconMap = Icons as unknown as Record<string, Icons.LucideIcon>;

export default function AppShell({ route, navigate, children }: { route: Route; navigate: (r: Route) => void; children: ReactNode }) {
  const { state } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const xpInLevel = state.xp % XP_PER_LEVEL;
  const xpPct = (xpInLevel / XP_PER_LEVEL) * 100;

  const NavList = () => (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {NAV_ITEMS.map((item) => {
        const Icon = iconMap[item.icon] || Icons.Circle;
        const active = route === item.id;
        return (
          <button
            key={item.id}
            onClick={() => { navigate(item.id); setSidebarOpen(false); }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
              active
                ? 'neon-btn'
                : 'text-secondary-c hover:text-primary-c hover:bg-white/5'
            }`}
          >
            <Icon size={18} className={active ? 'text-[rgb(var(--accent-soft))]' : 'group-hover:text-[rgb(var(--accent))]'} />
            <span>{item.label}</span>
            {active && <Icons.ChevronRight size={14} className="ml-auto text-[rgb(var(--accent-soft))]" />}
          </button>
        );
      })}
    </nav>
  );

  const UserPanel = () => (
    <div className="px-4 py-4 border-t border-white/5">
      <div className="glass rounded-xl p-3">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full neon-border flex items-center justify-center font-display font-bold text-[rgb(var(--accent-soft))]">
            {state.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-primary-c truncate">{state.name}</div>
            <div className="text-xs text-secondary-c">Level {state.level}</div>
          </div>
          <div className="flex items-center gap-1 text-xs text-[rgb(var(--accent-soft))]">
            <Icons.Flame size={14} />
            {state.streak}
          </div>
        </div>
        <div className="flex justify-between text-xs text-secondary-c mb-1">
          <span>XP</span>
          <span className="text-[rgb(var(--accent-soft))]">{xpInLevel}/{XP_PER_LEVEL}</span>
        </div>
        <div className="h-1.5 bg-base-3 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${xpPct}%`, background: 'linear-gradient(90deg, rgb(var(--accent-dim)), rgb(var(--accent-soft)))' }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-secondary-c flex items-center gap-1"><Icons.Coins size={12} className="text-yellow-400" />{state.coins}</span>
          <span className="text-secondary-c flex items-center gap-1"><Icons.Zap size={12} className="text-[rgb(var(--accent-soft))]" />{state.xp} XP</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <CustomCursor />
      <BackgroundEffects />

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed h-screen glass-strong border-r border-white/5 z-30">
        <div className="px-5 py-5 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg neon-border flex items-center justify-center">
            <Icons.GraduationCap size={20} className="text-[rgb(var(--accent-soft))]" />
          </div>
          <div>
            <div className="font-display font-bold text-sm gradient-text leading-tight">StudyOS X</div>
            <div className="text-[10px] text-muted-c uppercase tracking-widest">Class 10 Ultimate</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <NavList />
        </div>
        <UserPanel />
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 glass-strong border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icons.GraduationCap size={20} className="text-[rgb(var(--accent-soft))]" />
          <span className="font-display font-bold text-sm gradient-text">StudyOS X</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-white/5">
          {sidebarOpen ? <Icons.X size={20} /> : <Icons.Menu size={20} />}
        </button>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <aside className="absolute left-0 top-0 bottom-0 w-72 glass-strong border-r border-white/5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-5 flex items-center gap-2.5">
              <Icons.GraduationCap size={20} className="text-[rgb(var(--accent-soft))]" />
              <span className="font-display font-bold text-sm gradient-text">StudyOS X</span>
            </div>
            <div className="overflow-y-auto no-scrollbar h-[calc(100%-200px)]">
              <NavList />
            </div>
            <UserPanel />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
