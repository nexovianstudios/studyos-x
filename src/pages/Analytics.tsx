import { useMemo } from 'react';
import * as Icons from 'lucide-react';
import { useStore } from '../store';
import { GlassCard, SectionTitle, ProgressBar, EmptyState } from '../components/ui';

export default function Analytics() {
  const { state } = useStore();

  const totalMinutes = Object.values(state.heatmap).reduce((a, b) => a + b, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalSessions = state.sessions.length;
  const avgDuration = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

  const last7 = useMemo(() => {
    const days: { date: string; label: string; mins: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const ds = d.toISOString().slice(0, 10);
      days.push({ date: ds, label: d.toLocaleDateString('en', { weekday: 'short' }), mins: state.heatmap[ds] || 0 });
    }
    return days;
  }, [state.heatmap]);

  const last30 = useMemo(() => {
    const days: { date: string; mins: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const ds = d.toISOString().slice(0, 10);
      days.push({ date: ds, mins: state.heatmap[ds] || 0 });
    }
    return days;
  }, [state.heatmap]);

  const subjectData = useMemo(() => {
    const map: Record<string, number> = {};
    state.sessions.forEach((s) => { map[s.subject] = (map[s.subject] || 0) + s.duration; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [state.sessions]);

  const max7 = Math.max(60, ...last7.map((d) => d.mins));
  const max30 = Math.max(60, ...last30.map((d) => d.mins));
  const maxSubject = Math.max(1, ...subjectData.map(([, m]) => m));

  const heatmapData = useMemo(() => {
    const cells: { date: string; mins: number; intensity: number }[] = [];
    for (let i = 0; i < 84; i++) {
      const d = new Date(Date.now() - (83 - i) * 86400000);
      const ds = d.toISOString().slice(0, 10);
      const mins = state.heatmap[ds] || 0;
      cells.push({ date: ds, mins, intensity: mins === 0 ? 0 : Math.min(1, mins / 120) });
    }
    return cells;
  }, [state.heatmap]);

  const stats = [
    { label: 'Total Study Time', value: `${totalHours}h ${totalMinutes % 60}m`, icon: 'Clock', color: '#00d4ff' },
    { label: 'Total Sessions', value: totalSessions, icon: 'ListChecks', color: '#22f5ff' },
    { label: 'Avg Session', value: `${avgDuration}m`, icon: 'Timer', color: '#00ff9d' },
    { label: 'Current Streak', value: `${state.streak} days`, icon: 'Flame', color: '#ff6b35' },
    { label: 'Focus Score', value: state.focusScore, icon: 'Gauge', color: '#a78bfa' },
    { label: 'Best Day', value: `${Math.max(0, ...Object.values(state.heatmap))}m`, icon: 'Trophy', color: '#ffd700' },
  ];

  const iconMap = Icons as unknown as Record<string, Icons.LucideIcon>;

  return (
    <div className="space-y-6">
      <SectionTitle title="Analytics Center" subtitle="Track your study performance over time" icon={<Icons.BarChart3 size={24} />} />

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s) => {
          const Icon = iconMap[s.icon] || Icons.Circle;
          return (
            <GlassCard key={s.label} hover className="p-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2" style={{ background: `${s.color}20`, border: `1px solid ${s.color}40` }}>
                <Icon size={18} style={{ color: s.color }} />
              </div>
              <div className="text-xs text-secondary-c">{s.label}</div>
              <div className="font-display text-xl font-bold text-primary-c">{s.value}</div>
            </GlassCard>
          );
        })}
      </div>

      {/* Weekly graph */}
      <GlassCard className="p-6">
        <SectionTitle title="Weekly Study Hours" subtitle="Last 7 days" icon={<Icons.TrendingUp size={20} />} />
        <div className="flex items-end justify-between gap-2 h-48 mt-4">
          {last7.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-xs text-[rgb(var(--accent-soft))] font-semibold">{d.mins > 0 ? `${Math.floor(d.mins / 60)}h${d.mins % 60 > 0 ? `${d.mins % 60}m` : ''}` : ''}</div>
              <div className="w-full flex-1 flex items-end">
                <div className="w-full rounded-t-lg transition-all duration-500" style={{ height: `${(d.mins / max7) * 100}%`, minHeight: d.mins > 0 ? '8px' : '2px', background: d.mins > 0 ? 'linear-gradient(180deg, rgb(var(--accent-soft)), rgb(var(--accent-dim)))' : 'rgba(255,255,255,0.05)', boxShadow: d.mins > 0 ? '0 0 10px rgba(var(--accent),0.3)' : 'none' }} />
              </div>
              <span className="text-[10px] text-secondary-c">{d.label}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Monthly graph */}
      <GlassCard className="p-6">
        <SectionTitle title="Monthly Trend" subtitle="Last 30 days" icon={<Icons.LineChart size={20} />} />
        <div className="flex items-end justify-between gap-1 h-32 mt-4">
          {last30.map((d) => (
            <div key={d.date} className="flex-1 flex items-end" title={`${d.date}: ${d.mins}m`}>
              <div className="w-full rounded-t transition-all duration-300" style={{ height: `${(d.mins / max30) * 100}%`, minHeight: d.mins > 0 ? '4px' : '1px', background: d.mins > 0 ? 'rgb(var(--accent-soft))' : 'rgba(255,255,255,0.05)' }} />
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Subject analytics */}
        <GlassCard className="p-6">
          <SectionTitle title="Subject Analytics" subtitle="Time per subject" icon={<Icons.PieChart size={20} />} />
          {subjectData.length === 0 ? (
            <EmptyState icon={<Icons.PieChart size={40} />} title="No data yet" subtitle="Complete study sessions to see breakdown" />
          ) : (
            <div className="space-y-3 mt-4">
              {subjectData.map(([subject, mins]) => (
                <div key={subject}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-primary-c">{subject}</span>
                    <span className="text-[rgb(var(--accent-soft))]">{Math.floor(mins / 60)}h {mins % 60}m</span>
                  </div>
                  <ProgressBar value={mins} max={maxSubject} showValue={false} />
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Heatmap */}
        <GlassCard className="p-6">
          <SectionTitle title="Productivity Heatmap" subtitle="Last 12 weeks" icon={<Icons.Grid3x3 size={20} />} />
          <div className="grid grid-cols-12 gap-1.5 mt-4">
            {heatmapData.map((cell) => (
              <div key={cell.date} className="aspect-square rounded-sm transition-all hover:scale-125" style={{ background: cell.intensity === 0 ? 'rgba(255,255,255,0.04)' : `rgba(0, 212, 255, ${0.15 + cell.intensity * 0.7})`, boxShadow: cell.intensity > 0.5 ? '0 0 6px rgba(0,212,255,0.4)' : 'none' }} title={`${cell.date}: ${cell.mins} min`} />
            ))}
          </div>
          <div className="flex items-center justify-between mt-3 text-[10px] text-muted-c">
            <span>Less</span>
            <div className="flex gap-1">{[0.1, 0.3, 0.5, 0.7, 1].map((i) => <div key={i} className="w-3 h-3 rounded-sm" style={{ background: `rgba(0,212,255,${0.15 + i * 0.7})` }} />)}</div>
            <span>More</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
