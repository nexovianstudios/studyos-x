import { useEffect, useRef, useState } from 'react';
import * as Icons from 'lucide-react';
import { useStore } from '../store';
import { GlassCard, SectionTitle, NeonButton, EmptyState } from '../components/ui';

type Mode = 'pomodoro' | 'stopwatch' | 'countdown';
type StudyMode = 'Deep Work' | 'Revision Sprint' | 'Exam Panic' | 'Night Study';

const STUDY_MODES: { name: StudyMode; icon: string; color: string; work: number; break: number }[] = [
  { name: 'Deep Work', icon: 'Brain', color: '#00d4ff', work: 50, break: 10 },
  { name: 'Revision Sprint', icon: 'Zap', color: '#22f5ff', work: 25, break: 5 },
  { name: 'Exam Panic', icon: 'AlertTriangle', color: '#ff3b6b', work: 15, break: 3 },
  { name: 'Night Study', icon: 'Moon', color: '#a78bfa', work: 45, break: 15 },
];

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Social Science', 'English'];

export default function FocusZone() {
  const { state, recordSession, addXp, unlockAchievement, setState } = useStore();
  const [mode, setMode] = useState<Mode>('pomodoro');
  const [studyMode, setStudyMode] = useState<StudyMode>('Deep Work');
  const [subject, setSubject] = useState('Mathematics');
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);
  const [workMin, setWorkMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [countdownMin, setCountdownMin] = useState(10);
  const [stopwatchSec, setStopwatchSec] = useState(0);
  const [sessionNotes, setSessionNotes] = useState('');
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalForMode = mode === 'pomodoro' ? (isBreak ? breakMin : workMin) * 60 : mode === 'countdown' ? countdownMin * 60 : 0;

  useEffect(() => {
    if (mode === 'pomodoro') setSeconds((isBreak ? breakMin : workMin) * 60);
    else if (mode === 'countdown') setSeconds(countdownMin * 60);
    else setStopwatchSec(0);
    setIsRunning(false);
    setIsBreak(false);
  }, [mode, workMin, breakMin, countdownMin]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      if (mode === 'stopwatch') {
        setStopwatchSec((s) => s + 1);
      } else {
        setSeconds((s) => {
          if (s <= 1) {
            handleComplete();
            return 0;
          }
          return s - 1;
        });
      }
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, mode]);

  const handleComplete = () => {
    setIsRunning(false);
    if (mode === 'pomodoro' && !isBreak) {
      const duration = workMin;
      recordSession({ subject, mode: studyMode, duration, focusScore: Math.min(100, 50 + duration) });
      addXp(duration * 2);
      unlockAchievement('first-session');
      if (new Date().getHours() >= 22) unlockAchievement('night-owl');
      setCompletedSessions((c) => c + 1);
      setIsBreak(true);
      setSeconds(breakMin * 60);
      if (state.preferences.notifications && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('Break time!', { body: `Great work! Take a ${breakMin} min break.` });
      }
    } else if (mode === 'pomodoro' && isBreak) {
      setIsBreak(false);
      setSeconds(workMin * 60);
    } else if (mode === 'countdown') {
      const duration = countdownMin;
      recordSession({ subject, mode: 'Countdown', duration, focusScore: Math.min(100, 40 + duration) });
      addXp(duration * 2);
      unlockAchievement('first-session');
    }
  };

  const stop = () => {
    if (mode === 'stopwatch' && stopwatchSec > 60) {
      const duration = Math.floor(stopwatchSec / 60);
      recordSession({ subject, mode: studyMode, duration, focusScore: Math.min(100, 40 + duration) });
      addXp(duration * 2);
      unlockAchievement('first-session');
    }
    setIsRunning(false);
    if (mode === 'pomodoro') setSeconds((isBreak ? breakMin : workMin) * 60);
    else if (mode === 'countdown') setSeconds(countdownMin * 60);
    else setStopwatchSec(0);
  };

  const fmt = (s: number) => `${Math.floor(s / 3600).toString().padStart(2, '0')}:${Math.floor((s % 3600) / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const fmtMin = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const display = mode === 'stopwatch' ? stopwatchSec : seconds;
  const progress = totalForMode > 0 ? ((totalForMode - seconds) / totalForMode) * 100 : 0;
  const circumference = 2 * Math.PI * 130;
  const dashOffset = circumference - (progress / 100) * circumference;

  const recentSessions = state.sessions.slice(-8).reverse();
  const todayMin = state.heatmap[new Date().toISOString().slice(0, 10)] || 0;
  const weekMin = Object.entries(state.heatmap).filter(([d]) => {
    const diff = (Date.now() - new Date(d).getTime()) / 86400000;
    return diff >= 0 && diff < 7;
  }).reduce((sum, [, m]) => sum + m, 0);

  return (
    <div className="space-y-6">
      <SectionTitle title="Focus Zone" subtitle="Deep work, sprints, and study sessions" icon={<Icons.Timer size={24} />} />

      {/* Mode tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['pomodoro', 'stopwatch', 'countdown'] as Mode[]).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition-all ${mode === m ? 'neon-btn' : 'glass text-secondary-c'}`}>
            {m === 'pomodoro' && <Icons.Clock size={16} className="inline mr-1.5" />}
            {m === 'stopwatch' && <Icons.Timer size={16} className="inline mr-1.5" />}
            {m === 'countdown' && <Icons.Hourglass size={16} className="inline mr-1.5" />}
            {m}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Timer */}
        <GlassCard className="p-8 lg:col-span-2 flex flex-col items-center">
          {/* Study mode selector (pomodoro only) */}
          {mode === 'pomodoro' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mb-6">
              {STUDY_MODES.map((sm) => {
                const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[sm.icon] || Icons.Circle;
                return (
                  <button key={sm.name} onClick={() => { setStudyMode(sm.name); setWorkMin(sm.work); setBreakMin(sm.break); }} className={`rounded-xl p-3 text-center transition-all ${studyMode === sm.name ? 'neon-border' : 'glass'}`}>
                    <Icon size={18} className="mx-auto mb-1" style={{ color: sm.color }} />
                    <div className="text-[10px] font-medium text-primary-c">{sm.name}</div>
                    <div className="text-[9px] text-muted-c">{sm.work}/{sm.break}</div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Circular timer */}
          <div className="relative w-72 h-72 my-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 300 300">
              <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
              <circle
                cx="150" cy="150" r="130" fill="none"
                stroke={isBreak ? '#00ff9d' : 'rgb(var(--accent-soft))'}
                strokeWidth="6" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={mode === 'stopwatch' ? 0 : dashOffset}
                style={{ filter: 'drop-shadow(0 0 8px rgba(var(--accent),0.6))', transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-xs text-secondary-c uppercase tracking-widest mb-1">
                {mode === 'pomodoro' ? (isBreak ? 'Break' : studyMode) : mode}
              </div>
              <div className="font-display text-5xl font-bold gradient-text tabular-nums">
                {mode === 'stopwatch' ? fmt(display) : fmtMin(display)}
              </div>
              {mode === 'pomodoro' && <div className="text-xs text-muted-c mt-2">Session {completedSessions + 1}</div>}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3 mt-4">
            <NeonButton onClick={() => setIsRunning(!isRunning)} className="!px-8">
              {isRunning ? <><Icons.Pause size={18} /> Pause</> : <><Icons.Play size={18} /> Start</>}
            </NeonButton>
            <button onClick={stop} className="glass rounded-xl px-5 py-2.5 text-sm text-secondary-c hover:text-error transition-colors flex items-center gap-2">
              <Icons.Square size={16} /> Reset
            </button>
          </div>

          {/* Settings */}
          <div className="w-full mt-6 grid grid-cols-2 gap-4">
            {mode === 'pomodoro' && (
              <>
                <div>
                  <label className="text-xs text-secondary-c">Work (min): {workMin}</label>
                  <input type="range" min="5" max="90" value={workMin} onChange={(e) => setWorkMin(+e.target.value)} className="w-full mt-1" disabled={isRunning} />
                </div>
                <div>
                  <label className="text-xs text-secondary-c">Break (min): {breakMin}</label>
                  <input type="range" min="1" max="30" value={breakMin} onChange={(e) => setBreakMin(+e.target.value)} className="w-full mt-1" disabled={isRunning} />
                </div>
              </>
            )}
            {mode === 'countdown' && (
              <div className="col-span-2">
                <label className="text-xs text-secondary-c">Countdown (min): {countdownMin}</label>
                <input type="range" min="1" max="120" value={countdownMin} onChange={(e) => setCountdownMin(+e.target.value)} className="w-full mt-1" disabled={isRunning} />
              </div>
            )}
            <div className="col-span-2">
              <label className="text-xs text-secondary-c">Subject</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-base-2 border border-white/10 rounded-xl px-3 py-2 text-sm text-primary-c mt-1">
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Side panel */}
        <div className="space-y-4">
          <GlassCard className="p-5">
            <h3 className="font-display font-semibold text-sm mb-3 text-primary-c">Session Notes</h3>
            <textarea value={sessionNotes} onChange={(e) => setSessionNotes(e.target.value)} placeholder="What are you studying?" className="w-full bg-base-2 border border-white/10 rounded-xl p-3 text-sm text-primary-c placeholder:text-muted-c focus:outline-none focus:border-[rgba(var(--accent),0.5)] h-32 resize-none" />
            <button onClick={() => { setState((s) => ({ ...s, sessions: s.sessions.map((sess, i) => i === s.sessions.length - 1 ? { ...sess, notes: sessionNotes } : sess) })); setSessionNotes(''); }} className="text-xs neon-btn rounded-lg px-3 py-1.5 mt-2">Save to last session</button>
          </GlassCard>

          <GlassCard className="p-5">
            <h3 className="font-display font-semibold text-sm mb-3 text-primary-c">Today's Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-secondary-c">Sessions</span><span className="text-[rgb(var(--accent-soft))] font-semibold">{completedSessions}</span></div>
              <div className="flex justify-between text-sm"><span className="text-secondary-c">Today</span><span className="text-[rgb(var(--accent-soft))] font-semibold">{Math.floor(todayMin / 60)}h {todayMin % 60}m</span></div>
              <div className="flex justify-between text-sm"><span className="text-secondary-c">This week</span><span className="text-[rgb(var(--accent-soft))] font-semibold">{Math.floor(weekMin / 60)}h {weekMin % 60}m</span></div>
              <div className="flex justify-between text-sm"><span className="text-secondary-c">Streak</span><span className="text-[rgb(var(--accent-soft))] font-semibold flex items-center gap-1"><Icons.Flame size={14} />{state.streak}d</span></div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Session history */}
      <GlassCard className="p-6">
        <SectionTitle title="Session History" subtitle="Recent study sessions" icon={<Icons.History size={20} />} />
        {recentSessions.length === 0 ? (
          <EmptyState icon={<Icons.Clock size={40} />} title="No sessions yet" subtitle="Complete a focus session to see it here" />
        ) : (
          <div className="space-y-2">
            {recentSessions.map((s) => (
              <div key={s.id} className="glass rounded-lg p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg neon-border flex items-center justify-center flex-shrink-0">
                  <Icons.Clock size={14} className="text-[rgb(var(--accent-soft))]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-primary-c">{s.subject} · {s.mode}</div>
                  {s.notes && <div className="text-xs text-muted-c truncate">{s.notes}</div>}
                  <div className="text-[10px] text-muted-c">{new Date(s.date).toLocaleString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
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
  );
}
