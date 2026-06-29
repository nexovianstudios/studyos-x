import { useEffect } from 'react';
import * as Icons from 'lucide-react';
import { useStore, XP_PER_LEVEL } from '../store';
import { ACHIEVEMENTS } from '../data/cheatsheets';
import { GlassCard, SectionTitle, ProgressBar } from '../components/ui';

const iconMap = Icons as unknown as Record<string, Icons.LucideIcon>;

const BADGES = [
  { id: 'bronze', name: 'Bronze', color: '#cd7f32', req: 100 },
  { id: 'silver', name: 'Silver', color: '#c0c0c0', req: 500 },
  { id: 'gold', name: 'Gold', color: '#ffd700', req: 1500 },
  { id: 'platinum', name: 'Platinum', color: '#e5e4e2', req: 3000 },
  { id: 'diamond', name: 'Diamond', color: '#b9f2ff', req: 5000 },
];

export default function Gamification() {
  const { state, unlockAchievement } = useStore();

  // Auto-unlock based on stats
  useEffect(() => {
    if (state.favorites.filter((f) => f.startsWith('m-')).length >= 10) unlockAchievement('algebra-master');
    if (state.favorites.filter((f) => f.startsWith('m-tri') || f.startsWith('m-cg')).length >= 5) unlockAchievement('geometry-god');
    if (state.favorites.filter((f) => f.startsWith('p-')).length >= 8) unlockAchievement('physics-wizard');
    if (state.favorites.filter((f) => f.startsWith('c-')).length >= 8) unlockAchievement('chem-alchemist');
    if (state.bookmarks.length >= 5) unlockAchievement('history-king');
    if (Object.values(state.heatmap).reduce((a, b) => a + b, 0) >= 600) unlockAchievement('revision-beast');
    if (state.streak >= 7) unlockAchievement('streak-7');
    if (state.streak >= 30) unlockAchievement('streak-30');
    if (state.level >= 10) unlockAchievement('level-10');
  }, [state.favorites, state.bookmarks, state.heatmap, state.streak, state.level, unlockAchievement]);

  const xpInLevel = state.xp % XP_PER_LEVEL;
  const unlockedCount = state.achievements.length;
  const totalAchievements = ACHIEVEMENTS.length;

  const currentBadge = [...BADGES].reverse().find((b) => state.xp >= b.req) || BADGES[0];
  const nextBadge = BADGES.find((b) => state.xp < b.req);

  return (
    <div className="space-y-6">
      <SectionTitle title="Achievements" subtitle="Level up, earn XP, unlock badges" icon={<Icons.Trophy size={24} />} />

      {/* Level card */}
      <GlassCard className="p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgb(var(--accent)), transparent 70%)' }} />
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl neon-border flex items-center justify-center font-display text-3xl font-bold text-[rgb(var(--accent-soft))]">
              {state.level}
            </div>
            <div>
              <div className="text-xs text-secondary-c uppercase tracking-wider">Level</div>
              <div className="font-display text-2xl font-bold gradient-text">{state.level}</div>
              <div className="text-xs text-muted-c mt-1">{currentBadge.name} badge</div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-secondary-c">XP Progress</span>
              <span className="text-[rgb(var(--accent-soft))] font-semibold">{state.xp} total XP</span>
            </div>
            <ProgressBar value={xpInLevel} max={XP_PER_LEVEL} label={`Level ${state.level} → ${state.level + 1}`} />
            <div className="flex justify-between mt-3 text-xs">
              <span className="text-secondary-c flex items-center gap-1"><Icons.Coins size={14} className="text-yellow-400" />{state.coins} coins</span>
              <span className="text-secondary-c flex items-center gap-1"><Icons.Award size={14} className="text-[rgb(var(--accent-soft))]" />{unlockedCount}/{totalAchievements} achievements</span>
              {nextBadge && <span className="text-muted-c">Next: {nextBadge.name} ({nextBadge.req - state.xp} XP)</span>}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Badges */}
      <div>
        <h3 className="font-display font-semibold text-lg mb-4 text-primary-c">XP Badges</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {BADGES.map((b) => {
            const earned = state.xp >= b.req;
            return (
              <GlassCard key={b.id} className={`p-5 text-center transition-all ${earned ? 'card-hover' : 'opacity-40'}`}>
                <div className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ background: earned ? `${b.color}20` : 'rgba(255,255,255,0.05)', border: `2px solid ${earned ? b.color : 'rgba(255,255,255,0.1)'}`, boxShadow: earned ? `0 0 20px ${b.color}50` : 'none' }}>
                  <Icons.Award size={28} style={{ color: earned ? b.color : '#5a5f73' }} />
                </div>
                <div className="text-sm font-semibold text-primary-c">{b.name}</div>
                <div className="text-[10px] text-muted-c">{b.req} XP</div>
                {earned && <div className="text-[10px] text-success mt-1 flex items-center justify-center gap-1"><Icons.Check size={10} /> Earned</div>}
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h3 className="font-display font-semibold text-lg mb-4 text-primary-c">Achievements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map((a) => {
            const Icon = iconMap[a.icon] || Icons.Award;
            const earned = state.achievements.includes(a.id);
            return (
              <GlassCard key={a.id} className={`p-5 flex items-center gap-4 transition-all ${earned ? 'card-hover neon-border' : 'opacity-60'}`}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: earned ? 'rgba(var(--accent),0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${earned ? 'rgba(var(--accent),0.5)' : 'rgba(255,255,255,0.1)'}`, boxShadow: earned ? '0 0 15px rgba(var(--accent),0.3)' : 'none' }}>
                  <Icon size={22} className={earned ? 'text-[rgb(var(--accent-soft))]' : 'text-muted-c'} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-primary-c text-sm">{a.name}</div>
                  <div className="text-xs text-secondary-c">{a.description}</div>
                  <div className="text-[10px] text-muted-c mt-1">{a.requirement}</div>
                </div>
                {earned && <Icons.CheckCircle2 size={20} className="text-success flex-shrink-0" />}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
