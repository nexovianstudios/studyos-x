import { useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import { useStore } from '../store';
import { CHEAT_SHEETS, type CheatSheet } from '../data/cheatsheets';
import { GlassCard, SectionTitle, EmptyState } from '../components/ui';

const SUBJECTS = ['Mathematics', 'Science', 'Social Science', 'English'] as const;

export default function CheatSheets() {
  const { state, toggleBookmark } = useStore();
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return CHEAT_SHEETS.filter((c) => {
      if (subjectFilter !== 'all' && c.subject !== subjectFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return c.chapter.toLowerCase().includes(q) || c.formulas.some((f) => f.toLowerCase().includes(q)) || c.tips.some((t) => t.toLowerCase().includes(q));
      }
      return true;
    });
  }, [subjectFilter, search]);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpanded(new Set(filtered.map((c) => c.id)));
  const collapseAll = () => setExpanded(new Set());

  const printSheet = (sheet: CheatSheet) => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<html><head><title>${sheet.chapter} - Cheat Sheet</title><style>body{font-family:sans-serif;padding:40px;max-width:800px;margin:auto}h1{color:#0066ff}h2{border-bottom:2px solid #0066ff;padding-bottom:5px}ul{line-height:1.6}</style></head><body>`);
    win.document.write(`<h1>${sheet.chapter}</h1><p><em>${sheet.subject}</em></p>`);
    if (sheet.formulas.length) { win.document.write('<h2>Formulas</h2><ul>'); sheet.formulas.forEach((f) => win.document.write(`<li>${f}</li>`)); win.document.write('</ul>'); }
    if (sheet.shortcuts.length) { win.document.write('<h2>Shortcuts</h2><ul>'); sheet.shortcuts.forEach((s) => win.document.write(`<li>${s}</li>`)); win.document.write('</ul>'); }
    if (sheet.tricks.length) { win.document.write('<h2>Tricks</h2><ul>'); sheet.tricks.forEach((t) => win.document.write(`<li>${t}</li>`)); win.document.write('</ul>'); }
    if (sheet.faqs.length) { win.document.write('<h2>FAQs</h2>'); sheet.faqs.forEach((f) => win.document.write(`<p><strong>Q: ${f.q}</strong><br/>A: ${f.a}</p>`)); }
    if (sheet.tips.length) { win.document.write('<h2>Board Exam Tips</h2><ul>'); sheet.tips.forEach((t) => win.document.write(`<li>${t}</li>`)); win.document.write('</ul>'); }
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionTitle title="Cheat Sheet Library" subtitle="Chapter-wise quick reference" icon={<Icons.BookMarked size={24} />} />
        <div className="flex gap-2">
          <button onClick={expandAll} className="text-xs neon-btn rounded-lg px-3 py-1.5">Expand All</button>
          <button onClick={collapseAll} className="text-xs bg-base-2 border border-white/10 rounded-lg px-3 py-1.5 text-secondary-c">Collapse All</button>
        </div>
      </div>

      <GlassCard className="p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Icons.Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-c" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search chapters, formulas, tips..." className="w-full bg-base-2 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-primary-c placeholder:text-muted-c focus:outline-none focus:border-[rgba(var(--accent),0.5)]" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setSubjectFilter('all')} className={`rounded-lg px-3 py-2 text-xs ${subjectFilter === 'all' ? 'neon-btn' : 'bg-base-2 border border-white/10 text-secondary-c'}`}>All</button>
          {SUBJECTS.map((s) => (
            <button key={s} onClick={() => setSubjectFilter(s)} className={`rounded-lg px-3 py-2 text-xs ${subjectFilter === s ? 'neon-btn' : 'bg-base-2 border border-white/10 text-secondary-c'}`}>{s}</button>
          ))}
        </div>
      </GlassCard>

      {filtered.length === 0 ? (
        <EmptyState icon={<Icons.BookX size={48} />} title="No cheat sheets found" />
      ) : (
        <div className="space-y-3">
          {filtered.map((sheet) => {
            const isOpen = expanded.has(sheet.id);
            const isBookmarked = state.bookmarks.includes(sheet.id);
            return (
              <GlassCard key={sheet.id} className="overflow-hidden">
                <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => toggle(sheet.id)}>
                  <Icons.ChevronRight size={18} className={`text-[rgb(var(--accent-soft))] transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  <div className="flex-1">
                    <div className="text-[10px] uppercase tracking-wider text-muted-c">{sheet.subject}</div>
                    <div className="font-semibold text-primary-c">{sheet.chapter}</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); toggleBookmark(sheet.id); }} className="text-muted-c hover:text-[rgb(var(--accent-soft))] transition-colors p-1">
                    <Icons.Bookmark size={16} className={isBookmarked ? 'fill-current text-[rgb(var(--accent-soft))]' : ''} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); printSheet(sheet); }} className="text-muted-c hover:text-[rgb(var(--accent-soft))] transition-colors p-1">
                    <Icons.Printer size={16} />
                  </button>
                </div>
                {isOpen && (
                  <div className="px-4 pb-4 space-y-4 animate-fade-in">
                    {sheet.formulas.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-[rgb(var(--accent-soft))] uppercase tracking-wider mb-2 flex items-center gap-1.5"><Icons.Sigma size={14} /> Formulas</h4>
                        <ul className="space-y-1.5">
                          {sheet.formulas.map((f, i) => <li key={i} className="text-sm text-secondary-c glass rounded-lg px-3 py-2 font-mono">{f}</li>)}
                        </ul>
                      </div>
                    )}
                    {sheet.shortcuts.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-[rgb(var(--accent-soft))] uppercase tracking-wider mb-2 flex items-center gap-1.5"><Icons.Zap size={14} /> Shortcuts</h4>
                        <ul className="space-y-1">{sheet.shortcuts.map((s, i) => <li key={i} className="text-sm text-secondary-c flex gap-2"><Icons.ChevronRight size={14} className="text-[rgb(var(--accent))] mt-1 flex-shrink-0" />{s}</li>)}</ul>
                      </div>
                    )}
                    {sheet.tricks.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-[rgb(var(--accent-soft))] uppercase tracking-wider mb-2 flex items-center gap-1.5"><Icons.Sparkles size={14} /> Tricks</h4>
                        <ul className="space-y-1">{sheet.tricks.map((t, i) => <li key={i} className="text-sm text-secondary-c flex gap-2"><Icons.ChevronRight size={14} className="text-[rgb(var(--accent))] mt-1 flex-shrink-0" />{t}</li>)}</ul>
                      </div>
                    )}
                    {sheet.faqs.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-[rgb(var(--accent-soft))] uppercase tracking-wider mb-2 flex items-center gap-1.5"><Icons.HelpCircle size={14} /> FAQs</h4>
                        <div className="space-y-2">{sheet.faqs.map((f, i) => <div key={i} className="glass rounded-lg p-3"><div className="text-sm font-medium text-primary-c">Q: {f.q}</div><div className="text-sm text-secondary-c mt-1">A: {f.a}</div></div>)}</div>
                      </div>
                    )}
                    {sheet.tips.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-warning uppercase tracking-wider mb-2 flex items-center gap-1.5"><Icons.Lightbulb size={14} /> Board Exam Tips</h4>
                        <ul className="space-y-1">{sheet.tips.map((t, i) => <li key={i} className="text-sm text-secondary-c flex gap-2"><Icons.Star size={14} className="text-warning mt-1 flex-shrink-0" />{t}</li>)}</ul>
                      </div>
                    )}
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
