import { useState } from 'react';
import * as Icons from 'lucide-react';
import { useStore, type CalendarEvent } from '../store';
import { GlassCard, SectionTitle, NeonButton, Modal } from '../components/ui';

const EVENT_TYPES: { id: CalendarEvent['type']; label: string; color: string }[] = [
  { id: 'exam', label: 'Exam', color: '#ff3b6b' },
  { id: 'homework', label: 'Homework', color: '#ffb800' },
  { id: 'revision', label: 'Revision', color: '#00d4ff' },
  { id: 'study', label: 'Study', color: '#00ff9d' },
  { id: 'custom', label: 'Custom', color: '#a78bfa' },
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarCenter() {
  const { state, setState } = useStore();
  const [viewDate, setViewDate] = useState(new Date());
  const [showAdd, setShowAdd] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [newEvent, setNewEvent] = useState({ title: '', type: 'study' as CalendarEvent['type'], subject: '' });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = new Date().toISOString().slice(0, 10);

  const cells: (string | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d).toISOString().slice(0, 10);
    cells.push(date);
  }

  const eventsForDate = (date: string) => state.events.filter((e) => e.date === date);
  const upcomingEvents = state.events.filter((e) => e.date >= todayStr).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 10);

  const addEvent = () => {
    if (!newEvent.title.trim() || !selectedDate) return;
    const event: CalendarEvent = { id: crypto.randomUUID(), title: newEvent.title, date: selectedDate, type: newEvent.type, subject: newEvent.subject || undefined };
    setState((s) => ({ ...s, events: [...s.events, event] }));
    setNewEvent({ title: '', type: 'study', subject: '' });
    setShowAdd(false);
  };

  const removeEvent = (id: string) => setState((s) => ({ ...s, events: s.events.filter((e) => e.id !== id) }));

  const openAdd = (date: string) => { setSelectedDate(date); setShowAdd(true); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionTitle title="Calendar Center" subtitle="Exams, deadlines, and study schedule" icon={<Icons.Calendar size={24} />} />
        <NeonButton onClick={() => { setSelectedDate(todayStr); setShowAdd(true); }}><Icons.Plus size={16} /> Add Event</NeonButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar */}
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="p-2 rounded-lg hover:bg-white/5 text-secondary-c"><Icons.ChevronLeft size={20} /></button>
            <h3 className="font-display text-xl font-bold gradient-text">{MONTHS[month]} {year}</h3>
            <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="p-2 rounded-lg hover:bg-white/5 text-secondary-c"><Icons.ChevronRight size={20} /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((d) => <div key={d} className="text-center text-[10px] text-muted-c uppercase tracking-wider py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((date, i) => {
              if (!date) return <div key={i} />;
              const day = parseInt(date.slice(-2));
              const isToday = date === todayStr;
              const events = eventsForDate(date);
              return (
                <button key={i} onClick={() => openAdd(date)} className={`aspect-square rounded-lg p-1.5 text-left transition-all hover:neon-border ${isToday ? 'neon-border' : 'glass'}`}>
                  <div className={`text-xs font-medium ${isToday ? 'text-[rgb(var(--accent-soft))]' : 'text-secondary-c'}`}>{day}</div>
                  <div className="flex flex-col gap-0.5 mt-1">
                    {events.slice(0, 2).map((e) => {
                      const type = EVENT_TYPES.find((t) => t.id === e.type)!;
                      return <div key={e.id} className="text-[8px] rounded px-1 py-0.5 truncate" style={{ background: `${type.color}30`, color: type.color }}>{e.title}</div>;
                    })}
                    {events.length > 2 && <div className="text-[8px] text-muted-c">+{events.length - 2} more</div>}
                  </div>
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* Upcoming events */}
        <GlassCard className="p-6">
          <h3 className="font-display font-semibold text-sm mb-4 text-primary-c">Upcoming</h3>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-muted-c py-8 text-center">No upcoming events. Click a date to add one.</p>
          ) : (
            <div className="space-y-2">
              {upcomingEvents.map((e) => {
                const type = EVENT_TYPES.find((t) => t.id === e.type)!;
                const days = Math.ceil((new Date(e.date).getTime() - Date.now()) / 86400000);
                return (
                  <div key={e.id} className="glass rounded-lg p-3 group">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-primary-c truncate">{e.title}</div>
                        {e.subject && <div className="text-xs text-secondary-c">{e.subject}</div>}
                        <div className="text-[10px] text-muted-c mt-1">{new Date(e.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })} · {days === 0 ? 'Today' : `${days} day${days > 1 ? 's' : ''} away`}</div>
                      </div>
                      <div className="px-2 py-0.5 rounded-full text-[9px] font-medium flex-shrink-0" style={{ background: `${type.color}20`, color: type.color }}>{type.label}</div>
                      <button onClick={() => removeEvent(e.id)} className="text-muted-c hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"><Icons.X size={14} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={`Add Event — ${selectedDate ? new Date(selectedDate).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}`}>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-secondary-c">Title</label>
            <input autoFocus value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="e.g. Math Mock Test" className="w-full bg-base-2 border border-white/10 rounded-xl px-3 py-2 text-sm text-primary-c mt-1 focus:outline-none focus:border-[rgba(var(--accent),0.5)]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-secondary-c">Type</label>
              <select value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as CalendarEvent['type'] })} className="w-full bg-base-2 border border-white/10 rounded-xl px-3 py-2 text-sm text-primary-c mt-1">
                {EVENT_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-secondary-c">Subject (optional)</label>
              <input value={newEvent.subject} onChange={(e) => setNewEvent({ ...newEvent, subject: e.target.value })} placeholder="e.g. Physics" className="w-full bg-base-2 border border-white/10 rounded-xl px-3 py-2 text-sm text-primary-c mt-1" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowAdd(false)} className="glass rounded-xl px-4 py-2 text-sm text-secondary-c">Cancel</button>
            <NeonButton onClick={addEvent}><Icons.Plus size={16} /> Add</NeonButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
