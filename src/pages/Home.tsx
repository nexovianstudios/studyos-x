import { useEffect, useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import { useStore } from '../store';
import { QUOTES } from '../data/cheatsheets';
import { GlassCard, SectionTitle, StatPill, ProgressBar, NeonButton } from '../components/ui';
import type { Route } from '../router';

const iconMap = Icons as unknown as Record<string, Icons.LucideIcon>;

const SUBJECTS = [
  { name: 'Mathematics', icon: 'Sigma', color: '#00d4ff', chapters: 14 },
  { name: 'Physics', icon: 'Atom', color: '#22f5ff', chapters: 4 },
  { name: 'Chemistry', icon: 'FlaskConical', color: '#00ff9d', chapters: 4 },
  { name: 'Biology', icon: 'Dna', color: '#ffb800', chapters: 6 },
  { name: 'Social Science', icon: 'Globe2', color: '#ff3b6b', chapters: 20 },
  { name: 'English', icon: 'BookOpen', color: '#a78bfa', chapters: 11 },
];

const QUICK_LAUNCH: { route: Route; label: string; icon: string; desc: string }[] = [
  { route: 'focus', label: 'Start Focus', icon: 'Timer', desc: 'Pomodoro session' },
  { route: 'formulas', label: 'Formula Vault', icon: 'Sigma', desc: 'Search formulas' },
  { route: 'cheatsheets', label: 'Cheat Sheets', icon: 'BookMarked', desc: 'Chapter notes' },
  { route: 'ai', label: 'AI Assistant', icon: 'Bot', desc: 'Ask doubts' },
  { route: 'notes', label: 'Notes Hub', icon: 'StickyNote', desc: 'Quick note' },
  { route: 'mission', label: 'Missions', icon: 'CheckSquare', desc: 'Set goals' },
];

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function getExamCountdown() {
  const examDate = new Date('2026-03-01');
  const now = new Date();
  const diff = examDate.getTime() - now.getTime();
  const days = Math.max(0, Math.floor(diff / 86400000));
  const hours = Math.max(0, Math.floor((diff % 86400000) / 3600000));
  const mins = Math.max(0, Math.floor((diff % 3600000) / 60000));
  const secs = Math.max(0, Math.floor((diff % 60000) / 1000));
  return { days, hours, mins, secs };
}

export default function HomePage({ navigate }: { navigate: (r: Route) => void }) {
  const { state, setState } = useStore();
  const now = useClock();
  const [countdown, setCountdown] = useState(getExamCountdown());
  const quote = useMemo(() => {
    const idx = new Date().getDate() % QUOTES.length;
    return QUOTES[idx];
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCountdown(getExamCountdown()), 1000);
    return () => clearInterval(t);
  }, []);

  const todayStr = now.toISOString().slice(0, 10);
  const todayGoals = state.dailyGoals.filter((g) => g.date === todayStr);
  const completedGoals = todayGoals.filter((g) => g.done).length;
  const todayMinutes = state.heatmap[todayStr] || 0;

  const last7 = useMemo(() => {
    const days: { date: string; label: string; mins: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const ds = d.toISOString().slice(0, 10);
      days.push({ date: ds, label: d.toLocaleDateString('en', { weekday: 'short' }), mins: state.heatmap[ds] || 0 });
    }
    return days;
  }, [state.heatmap]);

  const maxMins = Math.max(60, ...last7.map((d) => d.mins));

  const heatmapData = useMemo(() => {
    const cells: { date: string; mins: number; intensity: number }[] = [];
    for (let i = 0; i < 84; i++) {
      const d = new Date(Date.now() - (83 - i) * 86400000);
      const ds = d.toISOString().slice(0, 10);
      const mins = state.heatmap[ds] || 0;
      const intensity = mins === 0 ? 0 : Math.min(1, mins / 120);
      cells.push({ date: ds, mins, intensity });
    }
    return cells;
  }, [state.heatmap]);

  const recentSessions = state.sessions.slice(-5).reverse();

  const toggleGoal = (id: string) => {
    setState((s) => ({
      ...s,
      dailyGoals: s.dailyGoals.map((g) => (g.id === id ? { ...g, done: !g.done } : g)),
    }));
  };

  const addGoal = () => {
    const title = prompt('New goal for today:');
    if (!title) return;
    setState((s) => ({
      ...s,
      dailyGoals: [...s.dailyGoals, { id: crypto.randomUUID(), title, done: false, date: todayStr }],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Welcome hero */}
      <GlassCard className="p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgb(var(--accent)), transparent 70%)' }} />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="text-sm text-secondary-c mb-1">{now.toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold mb-2">
              Welcome back, <span className="gradient-text">{state.name}</span>
            </h1>
            <p className="text-secondary-c italic max-w-xl">"{quote.text}" — <span className="text-muted-c">{quote.author}</span></p>
          </div>
          <div className="text-right">
            <div className="font-display text-4xl lg:text-5xl font-bold gradient-text tabular-nums">
              {now.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </div>
            <div className="text-sm text-secondary-c mt-1">Current time</div>
          </div>
        </div>
      </GlassCard>

      {/* Countdown + Stats row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="p-6 lg:col-span-2 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ background: 'linear-gradient(135deg, rgb(var(--accent)), transparent)' }} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Icons.Target size={18} className="text-[rgb(var(--accent-soft))]" />
              <h3 className="font-display font-semibold text-lg">Board Exam Countdown</h3>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Days', value: countdown.days },
                { label: 'Hours', value: countdown.hours },
                { label: 'Minutes', value: countdown.mins },
                { label: 'Seconds', value: countdown.secs },
              ].map((u) => (
                <div key={u.label} className="glass rounded-xl p-4 text-center">
                  <div className="font-display text-3xl lg:text-4xl font-bold gradient-text tabular-nums">{String(u.value).padStart(2, '0')}</div>
                  <div className="text-xs text-secondary-c uppercase tracking-wider mt-1">{u.label}</div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-2 gap-4">
          <StatPill label="Focus Score" value={`${state.focusScore}`} icon={<Icons.Gauge size={20} />} accent />
          <StatPill label="Streak" value={`${state.streak}d`} icon={<Icons.Flame size={20} />} />
          <StatPill label="Today" value={`${Math.floor(todayMinutes / 60)}h ${todayMinutes % 60}m`} icon={<Icons.Clock size={20} />} />
          <StatPill label="Level" value={state.level} icon={<Icons.Star size={20} />} />
        </div>
      </div>

      {/* Quick launch */}
      <div>
        <SectionTitle title="Quick Launch" subtitle="Jump into your study tools" icon={<Icons.Rocket size={22} />} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_LAUNCH.map((q) => {
            const Icon = iconMap[q.icon] || Icons.Circle;
            return (
              <button
                key={q.route}
                onClick={() => navigate(q.route)}
                className="glass card-hover rounded-xl p-4 flex flex-col items-center text-center gap-2 group"
              >
                <div className="w-11 h-11 rounded-xl neon-border flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon size={20} className="text-[rgb(var(--accent-soft))]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary-c">{q.label}</div>
                  <div className="text-[10px] text-muted-c">{q.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Today's goals + Weekly progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <SectionTitle title="Today's Goals" icon={<Icons.CheckCircle2 size={20} />} />
            <NeonButton onClick={addGoal} className="!px-3 !py-1.5 text-xs"><Icons.Plus size={14} /> Add</NeonButton>
          </div>
          {todayGoals.length === 0 ? (
            <p className="text-sm text-muted-c py-8 text-center">No goals set for today. Add one to get started!</p>
          ) : (
            <div className="space-y-2">
              {todayGoals.map((g) => (
                <label key={g.id} className="flex items-center gap-3 glass rounded-lg p-3 cursor-pointer hover:border-[rgba(var(--accent),0.3)] transition-colors">
                  <input type="checkbox" className="neon-check" checked={g.done} onChange={() => toggleGoal(g.id)} />
                  <span className={`text-sm ${g.done ? 'line-through text-muted-c' : 'text-primary-c'}`}>{g.title}</span>
                </label>
              ))}
              <div className="pt-2">
                <ProgressBar value={completedGoals} max={todayGoals.length} label="Goals completed" />
              </div>
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <SectionTitle title="Weekly Progress" subtitle="Study minutes per day" icon={<Icons.TrendingUp size={20} />} />
          <div className="flex items-end justify-between gap-2 h-40 mt-4">
            {last7.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
                    style={{
                      height: `${(d.mins / maxMins) * 100}%`,
                      minHeight: d.mins > 0 ? '8px' : '2px',
                      background: d.mins > 0 ? 'linear-gradient(180deg, rgb(var(--accent-soft)), rgb(var(--accent-dim)))' : 'rgba(255,255,255,0.05)',
                      boxShadow: d.mins > 0 ? '0 0 10px rgba(var(--accent), 0.3)' : 'none',
                    }}
                    title={`${d.mins} min`}
                  />
                </div>
                <span className="text-[10px] text-secondary-c">{d.label}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Subject completion cards */}
      <div>
        <SectionTitle title="Subject Progress" subtitle="Chapter completion overview" icon={<Icons.Layers size={22} />} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {SUBJECTS.map((s) => {
            const Icon = iconMap[s.icon] || Icons.Circle;
            const progress = state.subjectProgress[s.name] || 0;
            const pct = Math.min(100, (progress / 20) * 100);
            return (
              <GlassCard key={s.name} hover className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${s.color}20`, border: `1px solid ${s.color}40` }}>
                    <Icon size={18} style={{ color: s.color }} />
                  </div>
                  <div className="text-xs text-secondary-c">{s.chapters} ch</div>
                </div>
                <div className="text-sm font-semibold text-primary-c mb-2">{s.name}</div>
                <ProgressBar value={pct} showValue={false} />
                <div className="text-[10px] text-muted-c mt-1">{Math.round(pct)}% complete</div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Heatmap + Activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard className="p-6">
          <SectionTitle title="Productivity Heatmap" subtitle="Last 12 weeks" icon={<Icons.Grid3x3 size={20} />} />
          <div className="grid grid-cols-12 gap-1.5 mt-4">
            {heatmapData.map((cell) => (
              <div
                key={cell.date}
                className="aspect-square rounded-sm transition-all hover:scale-125"
                style={{
                  background: cell.intensity === 0 ? 'rgba(255,255,255,0.04)' : `rgba(0, 212, 255, ${0.15 + cell.intensity * 0.7})`,
                  boxShadow: cell.intensity > 0.5 ? '0 0 6px rgba(0,212,255,0.4)' : 'none',
                }}
                title={`${cell.date}: ${cell.mins} min`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between mt-3 text-[10px] text-muted-c">
            <span>Less</span>
            <div className="flex gap-1">
              {[0.1, 0.3, 0.5, 0.7, 1].map((i) => (
                <div key={i} className="w-3 h-3 rounded-sm" style={{ background: `rgba(0,212,255,${0.15 + i * 0.7})` }} />
              ))}
            </div>
            <span>More</span>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <SectionTitle title="Recent Activity" subtitle="Latest study sessions" icon={<Icons.Activity size={20} />} />
          {recentSessions.length === 0 ? (
            <p className="text-sm text-muted-c py-8 text-center">No sessions yet. Start a focus session to see activity here.</p>
          ) : (
            <div className="space-y-2">
              {recentSessions.map((s) => (
                <div key={s.id} className="glass rounded-lg p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg neon-border flex items-center justify-center flex-shrink-0">
                    <Icons.Clock size={14} className="text-[rgb(var(--accent-soft))]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-primary-c truncate">{s.subject} · {s.mode}</div>
                    <div className="text-xs text-muted-c">{new Date(s.date).toLocaleString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-[rgb(var(--accent-soft))]">{Math.floor(s.duration / 60)}h {s.duration % 60}m</div>
                    <div className="text-[10px] text-muted-c">Focus {s.focusScore}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
