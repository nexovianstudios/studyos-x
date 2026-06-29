import { useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import { useStore } from '../store';
import { FORMULAS, SUBJECTS, MATH_CHAPTERS, PHYSICS_CHAPTERS, CHEMISTRY_CHAPTERS, type Formula } from '../data/formulas';
import { GlassCard, SectionTitle, NeonButton, EmptyState } from '../components/ui';

const ALL_CHAPTERS = {
  Mathematics: MATH_CHAPTERS,
  Physics: PHYSICS_CHAPTERS,
  Chemistry: CHEMISTRY_CHAPTERS,
};

type View = 'grid' | 'flashcards' | 'random' | 'quiz';

export default function FormulaVault() {
  const { state, toggleFavorite, addXp, unlockAchievement } = useStore();
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [chapterFilter, setChapterFilter] = useState<string>('all');
  const [favOnly, setFavOnly] = useState(false);
  const [view, setView] = useState<View>('grid');
  const [flashIdx, setFlashIdx] = useState(0);
  const [flashFlipped, setFlashFlipped] = useState(false);
  const [quizQ, setQuizQ] = useState<{ formula: Formula; options: string[]; answer: string } | null>(null);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [quizAnswered, setQuizAnswered] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return FORMULAS.filter((f) => {
      if (favOnly && !state.favorites.includes(f.id)) return false;
      if (subjectFilter !== 'all' && f.subject !== subjectFilter) return false;
      if (chapterFilter !== 'all' && f.chapter !== chapterFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return f.name.toLowerCase().includes(q) || f.formula.toLowerCase().includes(q) || f.description.toLowerCase().includes(q) || f.chapter.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, subjectFilter, chapterFilter, favOnly, state.favorites]);

  const chapters = subjectFilter === 'all' ? [] : ALL_CHAPTERS[subjectFilter as keyof typeof ALL_CHAPTERS] || [];

  const startQuiz = () => {
    const pool = filtered.length > 3 ? filtered : FORMULAS;
    const formula = pool[Math.floor(Math.random() * pool.length)];
    const wrongs = FORMULAS.filter((f) => f.id !== formula.id).sort(() => Math.random() - 0.5).slice(0, 3).map((f) => f.name);
    const options = [...wrongs, formula.name].sort(() => Math.random() - 0.5);
    setQuizQ({ formula, options, answer: formula.name });
    setQuizAnswered(null);
  };

  const answerQuiz = (opt: string) => {
    if (!quizQ || quizAnswered) return;
    setQuizAnswered(opt);
    const correct = opt === quizQ.answer;
    setQuizScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    if (correct) {
      addXp(20);
      if (state.sessions.length >= 10) unlockAchievement('quiz-master');
    }
  };

  const flashCards = favOnly ? FORMULAS.filter((f) => state.favorites.includes(f.id)) : filtered;
  const currentFlash = flashCards[flashIdx];

  return (
    <div className="space-y-6">
      <SectionTitle title="Formula Vault" subtitle={`${FORMULAS.length} formulas across Math, Physics & Chemistry`} icon={<Icons.Sigma size={24} />} />

      {/* Controls */}
      <GlassCard className="p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Icons.Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-c" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search formulas, chapters, descriptions..."
              className="w-full bg-base-2 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-primary-c placeholder:text-muted-c focus:outline-none focus:border-[rgba(var(--accent),0.5)] focus:shadow-neon-soft transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={subjectFilter} onChange={(e) => { setSubjectFilter(e.target.value); setChapterFilter('all'); }} className="bg-base-2 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-primary-c focus:outline-none focus:border-[rgba(var(--accent),0.5)]">
              <option value="all">All Subjects</option>
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {chapters.length > 0 && (
              <select value={chapterFilter} onChange={(e) => setChapterFilter(e.target.value)} className="bg-base-2 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-primary-c focus:outline-none focus:border-[rgba(var(--accent),0.5)]">
                <option value="all">All Chapters</option>
                {chapters.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
            <button onClick={() => setFavOnly(!favOnly)} className={`rounded-xl px-3 py-2.5 text-sm flex items-center gap-1.5 transition-all ${favOnly ? 'neon-btn' : 'bg-base-2 border border-white/10 text-secondary-c'}`}>
              <Icons.Heart size={16} className={favOnly ? 'fill-current' : ''} /> Favorites
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['grid', 'flashcards', 'random', 'quiz'] as View[]).map((v) => (
            <button key={v} onClick={() => { setView(v); if (v === 'random') setFlashIdx(Math.floor(Math.random() * FORMULAS.length)); if (v === 'quiz') startQuiz(); }} className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all ${view === v ? 'neon-btn' : 'bg-base-2 border border-white/10 text-secondary-c hover:text-primary-c'}`}>
              {v === 'grid' && <Icons.LayoutGrid size={14} className="inline mr-1" />}
              {v === 'flashcards' && <Icons.CreditCard size={14} className="inline mr-1" />}
              {v === 'random' && <Icons.Shuffle size={14} className="inline mr-1" />}
              {v === 'quiz' && <Icons.HelpCircle size={14} className="inline mr-1" />}
              {v}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Grid view */}
      {view === 'grid' && (
        filtered.length === 0 ? (
          <EmptyState icon={<Icons.SearchX size={48} />} title="No formulas found" subtitle="Try adjusting your filters" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((f) => (
              <GlassCard key={f.id} hover className="p-5 group">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-wider text-muted-c px-2 py-0.5 rounded-full bg-base-3">{f.subject}</span>
                  <button onClick={() => toggleFavorite(f.id)} className="text-muted-c hover:text-error transition-colors">
                    <Icons.Heart size={16} className={state.favorites.includes(f.id) ? 'fill-error text-error' : ''} />
                  </button>
                </div>
                <div className="text-xs text-[rgb(var(--accent-soft))] mb-1">{f.chapter}</div>
                <h3 className="font-semibold text-primary-c mb-2">{f.name}</h3>
                <div className="glass rounded-lg p-3 my-3 text-center font-mono text-base text-[rgb(var(--accent-soft))] overflow-x-auto">
                  {f.formula}
                </div>
                <p className="text-xs text-secondary-c leading-relaxed">{f.description}</p>
                {f.variables && <p className="text-[10px] text-muted-c mt-2 italic">{f.variables}</p>}
              </GlassCard>
            ))}
          </div>
        )
      )}

      {/* Flashcards view */}
      {(view === 'flashcards' || view === 'random') && (
        <div className="max-w-2xl mx-auto">
          {flashCards.length === 0 ? (
            <EmptyState icon={<Icons.CreditCard size={48} />} title="No flashcards" subtitle="Add favorites to build your deck" />
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-secondary-c">Card {flashIdx + 1} / {flashCards.length}</span>
                <div className="flex gap-2">
                  <NeonButton onClick={() => { setFlashIdx((i) => (i - 1 + flashCards.length) % flashCards.length); setFlashFlipped(false); }} className="!px-3 !py-1.5"><Icons.ChevronLeft size={16} /></NeonButton>
                  <NeonButton onClick={() => { setFlashIdx((i) => (i + 1) % flashCards.length); setFlashFlipped(false); }} className="!px-3 !py-1.5"><Icons.ChevronRight size={16} /></NeonButton>
                </div>
              </div>
              <div className="[perspective:1000px] h-80 cursor-pointer" onClick={() => setFlashFlipped(!flashFlipped)}>
                <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d]" style={{ transform: flashFlipped ? 'rotateY(180deg)' : '' }}>
                  <div className="absolute inset-0 glass-strong rounded-2xl p-8 flex flex-col items-center justify-center text-center [backface-visibility:hidden]">
                    <div className="text-xs text-[rgb(var(--accent-soft))] uppercase tracking-wider mb-2">{currentFlash?.chapter}</div>
                    <h3 className="font-display text-xl font-bold text-primary-c mb-4">{currentFlash?.name}</h3>
                    <div className="font-mono text-2xl text-[rgb(var(--accent-soft))] neon-text">{currentFlash?.formula}</div>
                    <p className="text-xs text-muted-c mt-6">Click to flip</p>
                  </div>
                  <div className="absolute inset-0 glass-strong rounded-2xl p-8 flex flex-col items-center justify-center text-center [backface-visibility:hidden]" style={{ transform: 'rotateY(180deg)' }}>
                    <p className="text-secondary-c leading-relaxed">{currentFlash?.description}</p>
                    {currentFlash?.variables && <p className="text-xs text-muted-c mt-4 italic">{currentFlash.variables}</p>}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Quiz view */}
      {view === 'quiz' && quizQ && (
        <div className="max-w-2xl mx-auto">
          <GlassCard className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-secondary-c">Score: <span className="text-[rgb(var(--accent-soft))] font-bold">{quizScore.correct}</span> / {quizScore.total}</div>
              <NeonButton onClick={startQuiz} className="!px-3 !py-1.5 text-xs"><Icons.RefreshCw size={14} /> Next</NeonButton>
            </div>
            <div className="text-center mb-6">
              <div className="text-xs text-[rgb(var(--accent-soft))] uppercase tracking-wider mb-2">{quizQ.formula.chapter}</div>
              <div className="font-mono text-2xl text-[rgb(var(--accent-soft))] neon-text mb-4">{quizQ.formula.formula}</div>
              <p className="text-secondary-c">Which formula is this?</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quizQ.options.map((opt) => {
                const isAnswer = opt === quizQ.answer;
                const isPicked = opt === quizAnswered;
                let cls = 'glass hover:border-[rgba(var(--accent),0.4)]';
                if (quizAnswered) {
                  if (isAnswer) cls = 'border border-success bg-success/10 text-success';
                  else if (isPicked) cls = 'border border-error bg-error/10 text-error';
                  else cls = 'glass opacity-50';
                }
                return (
                  <button key={opt} onClick={() => answerQuiz(opt)} disabled={!!quizAnswered} className={`${cls} rounded-xl p-4 text-sm font-medium transition-all`}>
                    {opt}
                    {quizAnswered && isAnswer && <Icons.Check size={16} className="inline ml-2" />}
                    {quizAnswered && isPicked && !isAnswer && <Icons.X size={16} className="inline ml-2" />}
                  </button>
                );
              })}
            </div>
            {quizAnswered && (
              <div className="mt-4 text-center text-sm">
                {quizAnswered === quizQ.answer ? <span className="text-success">Correct! +20 XP</span> : <span className="text-error">Answer: {quizQ.answer}</span>}
              </div>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
}
