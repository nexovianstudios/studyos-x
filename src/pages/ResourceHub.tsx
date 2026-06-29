import * as Icons from 'lucide-react';
import { RESOURCES } from '../data/cheatsheets';
import { GlassCard, SectionTitle } from '../components/ui';

const iconMap = Icons as unknown as Record<string, Icons.LucideIcon>;

const CATEGORY_ICONS: Record<string, string> = {
  Textbooks: 'BookOpen',
  Practice: 'PencilRuler',
  Papers: 'FileText',
  Videos: 'Video',
  Solutions: 'CheckCircle',
};

export default function ResourceHub() {
  const categories = [...new Set(RESOURCES.map((r) => r.category))];

  return (
    <div className="space-y-6">
      <SectionTitle title="Resource Hub" subtitle="Official links and study materials" icon={<Icons.Globe size={24} />} />

      <GlassCard className="p-4 flex items-center gap-3">
        <Icons.Info size={18} className="text-[rgb(var(--accent-soft))] flex-shrink-0" />
        <p className="text-sm text-secondary-c">All links open official sources in a new tab. Always prefer NCERT textbooks as your primary reference for board exams.</p>
      </GlassCard>

      {categories.map((cat) => {
        const resources = RESOURCES.filter((r) => r.category === cat);
        const iconName = CATEGORY_ICONS[cat] || 'File';
        const Icon = iconMap[iconName] || Icons.File;
        return (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-3">
              <Icon size={20} className="text-[rgb(var(--accent-soft))]" />
              <h3 className="font-display font-semibold text-lg text-primary-c">{cat}</h3>
              <span className="text-xs text-muted-c">({resources.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((r) => (
                <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="glass card-hover rounded-2xl p-5 block group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl neon-border flex items-center justify-center">
                      <Icon size={18} className="text-[rgb(var(--accent-soft))]" />
                    </div>
                    <Icons.ExternalLink size={16} className="text-muted-c group-hover:text-[rgb(var(--accent-soft))] transition-colors" />
                  </div>
                  <h4 className="font-semibold text-primary-c text-sm mb-1">{r.name}</h4>
                  <p className="text-xs text-secondary-c leading-relaxed">{r.desc}</p>
                </a>
              ))}
            </div>
          </div>
        );
      })}

      <GlassCard className="p-6">
        <h3 className="font-display font-semibold text-sm mb-4 text-primary-c">Study Tips</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-secondary-c">
          <div className="flex gap-2"><Icons.CheckCircle2 size={16} className="text-success mt-0.5 flex-shrink-0" /><span>Read NCERT thoroughly before any reference book.</span></div>
          <div className="flex gap-2"><Icons.CheckCircle2 size={16} className="text-success mt-0.5 flex-shrink-0" /><span>Solve all NCERT exercise questions — they appear in boards.</span></div>
          <div className="flex gap-2"><Icons.CheckCircle2 size={16} className="text-success mt-0.5 flex-shrink-0" /><span>Practice at least 5 previous year papers per subject.</span></div>
          <div className="flex gap-2"><Icons.CheckCircle2 size={16} className="text-success mt-0.5 flex-shrink-0" /><span>Make formula sheets and revise them daily.</span></div>
          <div className="flex gap-2"><Icons.CheckCircle2 size={16} className="text-success mt-0.5 flex-shrink-0" /><span>Watch video lectures for concepts you find difficult.</span></div>
          <div className="flex gap-2"><Icons.CheckCircle2 size={16} className="text-success mt-0.5 flex-shrink-0" /><span>Use the Focus Zone for timed practice sessions.</span></div>
        </div>
      </GlassCard>
    </div>
  );
}
