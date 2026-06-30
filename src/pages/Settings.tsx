import { useState } from 'react';
import * as Icons from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore, type Theme, type EffectMode } from '../store';
import { GlassCard, SectionTitle } from '../components/ui';

const THEMES: { id: Theme; name: string; colors: string[] }[] = [
  { id: 'brabus-black', name: 'Brabus Black', colors: ['#050507', '#00d4ff', '#22f5ff'] },
  { id: 'cyber-blue', name: 'Cyber Blue', colors: ['#0a0a1a', '#0099ff', '#00d4ff'] },
  { id: 'matrix-green', name: 'Matrix Green', colors: ['#030a05', '#00ff88', '#64ffb4'] },
  { id: 'midnight-purple', name: 'Midnight Purple', colors: ['#08050f', '#a855f7', '#c084fc'] },
  { id: 'arctic-white', name: 'Arctic White', colors: ['#f0f2f8', '#0099ff', '#00d4ff'] },
];

const ACCENTS = ['#00d4ff', '#22f5ff', '#00ff9d', '#ffb800', '#ff3b6b', '#a78bfa', '#ff6b35', '#ffffff'];
const FONTS = ['Inter', 'Orbitron', 'JetBrains Mono', 'system-ui'];
const EFFECTS: { id: EffectMode; name: string }[] = [
  { id: 'none', name: 'Off' }, { id: 'particle', name: 'Particles' }, { id: 'rain', name: 'Rain' },
  { id: 'snow', name: 'Snow' }, { id: 'galaxy', name: 'Galaxy' }, { id: 'matrix', name: 'Matrix' },
  { id: 'cyberpunk', name: 'Cyberpunk' }, { id: 'minimal', name: 'Minimal' },
];

export default function Settings() {
  const { state, updatePreferences, setState, resetData } = useStore();
  const p = state.preferences;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="space-y-6">
      <SectionTitle title="Settings" subtitle="Customize your StudyOS experience" icon={<Icons.Settings size={24} />} />

      {/* Profile */}
      <GlassCard className="p-6">
        <h3 className="font-display font-semibold text-sm mb-4 text-primary-c">Profile</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl neon-border flex items-center justify-center font-display text-2xl font-bold text-[rgb(var(--accent-soft))]">
            {state.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <label className="text-xs text-secondary-c">Display Name</label>
            <input value={state.name} onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))} className="w-full bg-base-2 border border-white/10 rounded-xl px-3 py-2 text-sm text-primary-c mt-1 focus:outline-none focus:border-[rgba(var(--accent),0.5)]" />
          </div>
        </div>
      </GlassCard>

      {/* Theme */}
      <GlassCard className="p-6">
        <h3 className="font-display font-semibold text-sm mb-4 text-primary-c">Theme</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {THEMES.map((t) => (
            <button key={t.id} onClick={() => updatePreferences({ theme: t.id })} className={`glass card-hover rounded-xl p-4 text-center transition-all ${p.theme === t.id ? 'neon-border' : ''}`}>
              <div className="flex justify-center gap-1.5 mb-3">
                {t.colors.map((c, i) => <div key={i} className="w-6 h-6 rounded-full" style={{ background: c, border: '1px solid rgba(255,255,255,0.2)' }} />)}
              </div>
              <div className="text-xs font-medium text-primary-c">{t.name}</div>
              {p.theme === t.id && <div className="text-[10px] text-[rgb(var(--accent-soft))] mt-1 flex items-center justify-center gap-1"><Icons.Check size={10} /> Active</div>}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Accent color */}
      <GlassCard className="p-6">
        <h3 className="font-display font-semibold text-sm mb-4 text-primary-c">Accent Color</h3>
        <div className="flex gap-3 flex-wrap">
          {ACCENTS.map((c) => (
            <button key={c} onClick={() => updatePreferences({ accent: c })} className={`w-12 h-12 rounded-full transition-all ${p.accent === c ? 'ring-2 ring-white scale-110' : 'hover:scale-105'}`} style={{ background: c, boxShadow: p.accent === c ? `0 0 20px ${c}` : 'none' }} />
          ))}
        </div>
      </GlassCard>

      {/* Background effect */}
      <GlassCard className="p-6">
        <h3 className="font-display font-semibold text-sm mb-4 text-primary-c">Background Effect</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {EFFECTS.map((e) => (
            <button key={e.id} onClick={() => updatePreferences({ effectMode: e.id })} className={`glass rounded-xl p-3 text-sm transition-all ${p.effectMode === e.id ? 'neon-btn' : 'text-secondary-c'}`}>{e.name}</button>
          ))}
        </div>
      </GlassCard>

      {/* Font */}
      <GlassCard className="p-6">
        <h3 className="font-display font-semibold text-sm mb-4 text-primary-c">Font Family</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FONTS.map((f) => (
            <button key={f} onClick={() => updatePreferences({ font: f })} className={`glass rounded-xl p-3 text-sm transition-all ${p.font === f ? 'neon-btn' : 'text-secondary-c'}`} style={{ fontFamily: f }}>{f}</button>
          ))}
        </div>
      </GlassCard>

      {/* Timer settings */}
      <GlassCard className="p-6">
        <h3 className="font-display font-semibold text-sm mb-4 text-primary-c">Timer Defaults</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-xs text-secondary-c">Default Work Duration: {p.pomodoroWork} min</label>
            <input type="range" min="5" max="90" value={p.pomodoroWork} onChange={(e) => updatePreferences({ pomodoroWork: +e.target.value })} className="w-full mt-2" />
          </div>
          <div>
            <label className="text-xs text-secondary-c">Default Break Duration: {p.pomodoroBreak} min</label>
            <input type="range" min="1" max="30" value={p.pomodoroBreak} onChange={(e) => updatePreferences({ pomodoroBreak: +e.target.value })} className="w-full mt-2" />
          </div>
        </div>
      </GlassCard>

      {/* Notifications */}
      <GlassCard className="p-6">
        <h3 className="font-display font-semibold text-sm mb-4 text-primary-c">Notifications</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-sm text-primary-c">Browser Notifications</div>
              <div className="text-xs text-muted-c">Get notified when focus sessions end</div>
            </div>
            <input type="checkbox" className="neon-check" checked={p.notifications} onChange={(e) => {
              updatePreferences({ notifications: e.target.checked });
              if (e.target.checked && 'Notification' in window) Notification.requestPermission();
            }} />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-sm text-primary-c">Sound Effects</div>
              <div className="text-xs text-muted-c">Audio feedback for actions</div>
            </div>
            <input type="checkbox" className="neon-check" checked={p.soundEnabled} onChange={(e) => updatePreferences({ soundEnabled: e.target.checked })} />
          </label>
        </div>
      </GlassCard>

{/* Cloud Account */}
<GlassCard className="p-6">
  <h3 className="font-display font-semibold text-sm mb-4 text-primary-c">
    Cloud Account
  </h3>

  <div className="space-y-3">
    <input
      type="email"
      placeholder="Email Address"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full bg-base-2 border border-white/10 rounded-xl px-3 py-2 text-sm text-primary-c"
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full bg-base-2 border border-white/10 rounded-xl px-3 py-2 text-sm text-primary-c"
    />

    <div className="flex gap-3 flex-wrap">
      <button
        className="neon-btn px-5 py-2 rounded-xl"
        onClick={async () => {
          const { error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) {
            alert(error.message);
          } else {
            alert('Account created successfully!');
          }
        }}
      >
        Sign Up
      </button>

      <button
        className="glass px-5 py-2 rounded-xl"
        onClick={async () => {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            alert(error.message);
          } else {
            alert('Login successful!');
          }
        }}
      >
        Login
      </button>

      <button
        className="glass px-5 py-2 rounded-xl"
        onClick={async () => {
          await supabase.auth.signOut();
          alert('Logged out successfully!');
        }}
      >
        Logout
      </button>
    </div>

    <div className="text-xs text-secondary-c mt-2">
      Sign in to sync XP, streaks, coins and progress across all your devices.
    </div>
  </div>
</GlassCard>

      {/* Data management */}
      <GlassCard className="p-6">
        <h3 className="font-display font-semibold text-sm mb-4 text-primary-c">Data Management</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 glass rounded-xl p-4">
            <div className="text-sm text-primary-c font-medium mb-1">Storage</div>
            <div className="text-xs text-secondary-c">All data is stored locally in your browser. It persists across refreshes but is device-specific.</div>
          </div>
          <button onClick={() => { if (confirm('This will permanently delete ALL your data (XP, notes, goals, sessions, achievements). This cannot be undone. Continue?')) resetData(); }} className="glass rounded-xl px-5 py-3 text-sm text-error border border-error/30 hover:bg-error/10 transition-colors flex items-center gap-2 self-start">
            <Icons.Trash2 size={16} /> Reset All Data
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
