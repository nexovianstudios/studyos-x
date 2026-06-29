import * as Icons from 'lucide-react';
import { useStore, type EffectMode } from '../store';
import { GlassCard, SectionTitle } from '../components/ui';

const EFFECTS: { id: EffectMode; name: string; icon: string; desc: string; color: string }[] = [
  { id: 'none', name: 'Off', icon: 'CircleSlash', desc: 'No background effects', color: '#5a5f73' },
  { id: 'particle', name: 'Particles', icon: 'Sparkles', desc: 'Connected particle network', color: '#00d4ff' },
  { id: 'rain', name: 'Rain', icon: 'CloudRain', desc: 'Falling rain streaks', color: '#0099ff' },
  { id: 'snow', name: 'Snow', icon: 'Snowflake', desc: 'Gentle snowfall', color: '#ffffff' },
  { id: 'galaxy', name: 'Galaxy', icon: 'Orbit', desc: 'Spiraling cosmic dust', color: '#a78bfa' },
  { id: 'matrix', name: 'Matrix', icon: 'Binary', desc: 'Digital rain code', color: '#00ff88' },
  { id: 'cyberpunk', name: 'Cyberpunk', icon: 'Zap', desc: 'Neon glowing particles', color: '#ff00ff' },
  { id: 'minimal', name: 'Minimal', icon: 'Minus', desc: 'Subtle floating dots', color: '#22f5ff' },
];

const iconMap = Icons as unknown as Record<string, Icons.LucideIcon>;

export default function ImmersiveEffects() {
  const { state, updatePreferences } = useStore();
  const current = state.preferences.effectMode;

  return (
    <div className="space-y-6">
      <SectionTitle title="Immersive Effects" subtitle="Transform your study environment" icon={<Icons.Sparkles size={24} />} />

      <GlassCard className="p-4 flex items-center gap-3">
        <Icons.Eye size={18} className="text-[rgb(var(--accent-soft))] flex-shrink-0" />
        <p className="text-sm text-secondary-c">Effects render on the canvas behind all content. They\'re lightweight and won\'t slow down your study sessions. Try them all!</p>
      </GlassCard>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {EFFECTS.map((e) => {
          const Icon = iconMap[e.icon] || Icons.Circle;
          const isActive = current === e.id;
          return (
            <button key={e.id} onClick={() => updatePreferences({ effectMode: e.id })} className={`glass card-hover rounded-2xl p-5 text-center transition-all ${isActive ? 'neon-border' : ''}`}>
              <div className="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `${e.color}15`, border: `1px solid ${e.color}40`, boxShadow: isActive ? `0 0 20px ${e.color}50` : 'none' }}>
                <Icon size={26} style={{ color: e.color }} />
              </div>
              <div className="font-semibold text-primary-c text-sm">{e.name}</div>
              <div className="text-[10px] text-muted-c mt-1">{e.desc}</div>
              {isActive && <div className="text-[10px] text-[rgb(var(--accent-soft))] mt-2 flex items-center justify-center gap-1"><Icons.Check size={12} /> Active</div>}
            </button>
          );
        })}
      </div>

      <GlassCard className="p-6">
        <h3 className="font-display font-semibold text-sm mb-3 text-primary-c">Effect Guide</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-secondary-c">
          <div className="flex gap-2"><Icons.Sparkles size={16} className="text-[rgb(var(--accent))] mt-0.5 flex-shrink-0" /><span><strong className="text-primary-c">Particles</strong> — Best for focus. Subtle connections create a tech aesthetic.</span></div>
          <div className="flex gap-2"><Icons.CloudRain size={16} className="text-[#0099ff] mt-0.5 flex-shrink-0" /><span><strong className="text-primary-c">Rain</strong> — Calming and cozy. Pairs well with the Rain ambience sound.</span></div>
          <div className="flex gap-2"><Icons.Snowflake size={16} className="text-white mt-0.5 flex-shrink-0" /><span><strong className="text-primary-c">Snow</strong> — Peaceful and minimal. Great for night study.</span></div>
          <div className="flex gap-2"><Icons.Orbit size={16} className="text-[#a78bfa] mt-0.5 flex-shrink-0" /><span><strong className="text-primary-c">Galaxy</strong> — Mesmerizing spiral. Inspires big-picture thinking.</span></div>
          <div className="flex gap-2"><Icons.Binary size={16} className="text-[#00ff88] mt-0.5 flex-shrink-0" /><span><strong className="text-primary-c">Matrix</strong> — Hacker aesthetic. Fun for coding or math sessions.</span></div>
          <div className="flex gap-2"><Icons.Zap size={16} className="text-[#ff00ff] mt-0.5 flex-shrink-0" /><span><strong className="text-primary-c">Cyberpunk</strong> — High-energy neon. For exam panic mode energy.</span></div>
        </div>
      </GlassCard>
    </div>
  );
}
