import { useState } from 'react';
import * as Icons from 'lucide-react';
import { useStore, type Goal } from '../store';
import { GlassCard, SectionTitle, NeonButton, EmptyState, Modal } from '../components/ui';

const TYPES: { id: Goal['type']; label: string; icon: string }[] = [
  { id: 'daily', label: 'Daily', icon: 'Sun' },
  { id: 'weekly', label: 'Weekly', icon: 'CalendarDays' },
  { id: 'monthly', label: 'Monthly', icon: 'CalendarRange' },
  { id: 'subject', label: 'Subject', icon: 'BookOpen' },
  { id: 'chapter', label: 'Chapter', icon: 'Bookmark' },
];

const PRIORITIES: { id: Goal['priority']; label: string; color: string }[] = [
  { id: 'high', label: 'High', color: '#ff3b6b' },
  { id: 'medium', label: 'Medium', color: '#ffb800' },
  { id: 'low', label: 'Low', color: '#00ff9d' },
];

const iconMap = Icons as unknown as Record<string, Icons.LucideIcon>;

export default function MissionControl() {
  const { state, setState, addXp } = useStore();
  const [filter, setFilter] = useState<Goal['type'] | 'all'>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({ title: '', type: 'daily' as Goal['type'], priority: 'medium' as Goal['priority'], dueDate: '', notes: '', subject: '' });

  const goals = state.goals.filter((g) => filter === 'all' || g.type === filter).sort((a, b) => a.order - b.order);

  const addGoal = () => {
    if (!newGoal.title.trim()) return;
    const goal: Goal = {
      id: crypto.randomUUID(),
      title: newGoal.title,
      type: newGoal.type,
      priority: newGoal.priority,
      done: false,
      dueDate: newGoal.dueDate || undefined,
      notes: newGoal.notes || undefined,
      subject: newGoal.subject || undefined,
      order: state.goals.length,
    };
    setState((s) => ({ ...s, goals: [...s.goals, goal] }));
    setNewGoal({ title: '', type: 'daily', priority: 'medium', dueDate: '', notes: '', subject: '' });
    setShowAdd(false);
  };

  const toggle = (id: string) => {
    const goal = state.goals.find((g) => g.id === id);
    setState((s) => ({ ...s, goals: s.goals.map((g) => (g.id === id ? { ...g, done: !g.done } : g)) }));
    if (goal && !goal.done) addXp(15);
  };

  const remove = (id: string) => setState((s) => ({ ...s, goals: s.goals.filter((g) => g.id !== id) }));

  const onDragStart = (id: string) => setDragId(id);
  const onDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const goalsCopy = [...state.goals];
    const dragIdx = goalsCopy.findIndex((g) => g.id === dragId);
    const targetIdx = goalsCopy.findIndex((g) => g.id === targetId);
    const [moved] = goalsCopy.splice(dragIdx, 1);
    goalsCopy.splice(targetIdx, 0, moved);
    goalsCopy.forEach((g, i) => (g.order = i));
    setState((s) => ({ ...s, goals: goalsCopy }));
    setDragId(null);
  };

  const completed = goals.filter((g) => g.done).length;
  const total = goals.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionTitle title="Mission Control" subtitle="Track goals across all timeframes" icon={<Icons.CheckSquare size={24} />} />
        <NeonButton onClick={() => setShowAdd(true)}><Icons.Plus size={16} /> New Goal</NeonButton>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter('all')} className={`rounded-lg px-3 py-1.5 text-xs ${filter === 'all' ? 'neon-btn' : 'glass text-secondary-c'}`}>All ({state.goals.length})</button>
        {TYPES.map((t) => {
          const Icon = iconMap[t.icon] || Icons.Circle;
          const count = state.goals.filter((g) => g.type === t.id).length;
          return (
            <button key={t.id} onClick={() => setFilter(t.id)} className={`rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 ${filter === t.id ? 'neon-btn' : 'glass text-secondary-c'}`}>
              <Icon size={14} /> {t.label} ({count})
            </button>
          );
        })}
      </div>

      {total > 0 && (
        <GlassCard className="p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-secondary-c">Progress</span>
            <span className="text-[rgb(var(--accent-soft))] font-semibold">{completed} / {total}</span>
          </div>
          <div className="h-2 bg-base-3 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(completed / total) * 100}%`, background: 'linear-gradient(90deg, rgb(var(--accent-dim)), rgb(var(--accent-soft)))' }} />
          </div>
        </GlassCard>
      )}

      {goals.length === 0 ? (
        <EmptyState icon={<Icons.Target size={48} />} title="No goals yet" subtitle="Create your first goal to start tracking" />
      ) : (
        <div className="space-y-2">
          {goals.map((g) => {
            const priority = PRIORITIES.find((p) => p.id === g.priority)!;
            const type = TYPES.find((t) => t.id === g.type)!;
            const TypeIcon = iconMap[type.icon] || Icons.Circle;
            const overdue = g.dueDate && new Date(g.dueDate) < new Date() && !g.done;
            return (
              <div
                key={g.id}
                draggable
                onDragStart={() => onDragStart(g.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(g.id)}
                className={`glass rounded-xl p-4 flex items-center gap-3 transition-all ${dragId === g.id ? 'opacity-50' : ''} ${g.done ? 'opacity-60' : ''}`}
              >
                <Icons.GripVertical size={16} className="text-muted-c cursor-grab flex-shrink-0" />
                <input type="checkbox" className="neon-check" checked={g.done} onChange={() => toggle(g.id)} />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${g.done ? 'line-through text-muted-c' : 'text-primary-c'}`}>{g.title}</div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[10px] flex items-center gap-1 text-secondary-c"><TypeIcon size={10} />{type.label}</span>
                    {g.subject && <span className="text-[10px] text-secondary-c">· {g.subject}</span>}
                    {g.dueDate && <span className={`text-[10px] ${overdue ? 'text-error' : 'text-muted-c'}`}>· Due {new Date(g.dueDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })}{overdue ? ' (overdue)' : ''}</span>}
                    {g.notes && <span className="text-[10px] text-muted-c italic">· {g.notes}</span>}
                  </div>
                </div>
                <div className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: `${priority.color}20`, color: priority.color }}>{priority.label}</div>
                <button onClick={() => remove(g.id)} className="text-muted-c hover:text-error transition-colors p-1"><Icons.Trash2 size={14} /></button>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New Goal">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-secondary-c">Title</label>
            <input autoFocus value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} placeholder="e.g. Complete Trigonometry chapter" className="w-full bg-base-2 border border-white/10 rounded-xl px-3 py-2 text-sm text-primary-c mt-1 focus:outline-none focus:border-[rgba(var(--accent),0.5)]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-secondary-c">Type</label>
              <select value={newGoal.type} onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value as Goal['type'] })} className="w-full bg-base-2 border border-white/10 rounded-xl px-3 py-2 text-sm text-primary-c mt-1">
                {TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-secondary-c">Priority</label>
              <select value={newGoal.priority} onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as Goal['priority'] })} className="w-full bg-base-2 border border-white/10 rounded-xl px-3 py-2 text-sm text-primary-c mt-1">
                {PRIORITIES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-secondary-c">Due Date</label>
              <input type="date" value={newGoal.dueDate} onChange={(e) => setNewGoal({ ...newGoal, dueDate: e.target.value })} className="w-full bg-base-2 border border-white/10 rounded-xl px-3 py-2 text-sm text-primary-c mt-1" />
            </div>
            <div>
              <label className="text-xs text-secondary-c">Subject (optional)</label>
              <input value={newGoal.subject} onChange={(e) => setNewGoal({ ...newGoal, subject: e.target.value })} placeholder="e.g. Mathematics" className="w-full bg-base-2 border border-white/10 rounded-xl px-3 py-2 text-sm text-primary-c mt-1" />
            </div>
          </div>
          <div>
            <label className="text-xs text-secondary-c">Notes (optional)</label>
            <input value={newGoal.notes} onChange={(e) => setNewGoal({ ...newGoal, notes: e.target.value })} placeholder="Add context..." className="w-full bg-base-2 border border-white/10 rounded-xl px-3 py-2 text-sm text-primary-c mt-1" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowAdd(false)} className="glass rounded-xl px-4 py-2 text-sm text-secondary-c">Cancel</button>
            <NeonButton onClick={addGoal}><Icons.Plus size={16} /> Add Goal</NeonButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
