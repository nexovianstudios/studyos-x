import { useState } from 'react';
import * as Icons from 'lucide-react';
import { useStore } from '../store';
import { FORMULAS } from '../data/formulas';
import { CHEAT_SHEETS } from '../data/cheatsheets';
import { GlassCard, SectionTitle, NeonButton, EmptyState } from '../components/ui';

type Tool = 'doubt' | 'quiz' | 'explain' | 'flashcards' | 'summarize' | 'plan';

const TOOLS: { id: Tool; name: string; icon: string; desc: string; color: string }[] = [
  { id: 'doubt', name: 'Ask a Doubt', icon: 'HelpCircle', desc: 'Get explanations', color: '#00d4ff' },
  { id: 'quiz', name: 'Generate Quiz', icon: 'FileQuestion', desc: 'Test yourself', color: '#22f5ff' },
  { id: 'explain', name: 'Explain Concept', icon: 'Lightbulb', desc: 'Break it down', color: '#00ff9d' },
  { id: 'flashcards', name: 'Create Flashcards', icon: 'CreditCard', desc: 'Study cards', color: '#ffb800' },
  { id: 'summarize', name: 'Summarize Chapter', icon: 'FileText', desc: 'Key points', color: '#a78bfa' },
  { id: 'plan', name: 'Revision Plan', icon: 'CalendarCheck', desc: 'Study schedule', color: '#ff6b35' },
];

const iconMap = Icons as unknown as Record<string, Icons.LucideIcon>;

interface Msg { role: 'user' | 'ai'; content: string; data?: unknown }

// Local knowledge base for generating responses
const KNOWLEDGE: Record<string, string> = {
  'quadratic': 'A quadratic equation has the form ax² + bx + c = 0 (a ≠ 0). The roots are found using x = [-b ± √(b²-4ac)] / 2a. The discriminant D = b²-4ac tells you the nature of roots: D>0 means two distinct real roots, D=0 means one repeated root, and D<0 means no real roots (only complex).',
  'trigonometry': 'Trigonometry studies relationships between angles and sides of triangles. The three main ratios are: sin θ = opposite/hypotenuse, cos θ = adjacent/hypotenuse, tan θ = opposite/adjacent. Key identity: sin²θ + cos²θ = 1. Standard values: sin 30° = 1/2, sin 45° = 1/√2, sin 60° = √3/2.',
  'electricity': 'Ohm\'s Law states V = IR (voltage = current × resistance). Resistance depends on material: R = ρl/A where ρ is resistivity, l is length, A is cross-sectional area. In series, resistances add (R = R₁+R₂+...). In parallel, 1/R = 1/R₁+1/R₂+... Electric power P = VI = I²R = V²/R.',
  'chemical reaction': 'Chemical reactions involve transformation of substances. Types: Combination (A+B→AB), Decomposition (AB→A+B), Displacement (A+BC→AC+B), Double Displacement (AB+CD→AD+CB). Oxidation is loss of electrons; reduction is gain. Redox reactions involve both simultaneously.',
  'acid base': 'Acids release H⁺ ions, bases release OH⁻ ions. The pH scale (0-14) measures acidity: pH < 7 is acidic, pH = 7 is neutral, pH > 7 is basic. Neutralization: Acid + Base → Salt + Water. Strong acids (HCl, H₂SO₄, HNO₃) fully ionize; weak acids partially ionize.',
  'carbon': 'Carbon forms covalent bonds and has the unique property of catenation (forming chains/rings). Saturated hydrocarbons (alkanes) have formula CₙH₂ₙ₊₂. Unsaturated: alkenes CₙH₂ₙ (double bond), alkynes CₙH₂ₙ₋₂ (triple bond). Functional groups: -OH (alcohol), -CHO (aldehyde), -CO (ketone), -COOH (carboxylic acid).',
  'light': 'Light reflects off surfaces following the law of reflection (angle of incidence = angle of reflection). Mirrors use 1/v + 1/u = 1/f. Refraction follows Snell\'s law: n = sin i / sin r. Lenses use 1/v - 1/u = 1/f. Power of a lens P = 1/f (in diopters when f in meters).',
  'magnetism': 'A current-carrying conductor produces a magnetic field. For a straight wire: B = μ₀I/(2πr). For a circular loop: B = μ₀I/(2R). Fleming\'s left-hand rule gives force direction: thumb=Force, forefinger=Field, middle=Current. F = BIL sin θ. Electromagnetic induction: changing magnetic field induces current.',
  'probability': 'Probability measures likelihood of events. P(E) = favorable outcomes / total outcomes. Range: 0 ≤ P(E) ≤ 1. Complement: P(not E) = 1 - P(E). For a die: 6 outcomes. For two dice: 36 outcomes. For a deck of cards: 52 cards (4 suits × 13).',
  'statistics': 'Statistics involves collecting and analyzing data. Mean = Σfx/Σf. Median is the middle value. Mode is the most frequent value. Empirical relation: 3 Median = 2 Mean + Mode. For grouped data, use class intervals and cumulative frequency.',
  'arithmetic progression': 'An AP is a sequence where each term differs from the previous by a constant (common difference d). nth term: aₙ = a + (n-1)d. Sum of n terms: Sₙ = n/2[2a + (n-1)d] or Sₙ = n/2(a + l) where l is the last term.',
  'circle': 'A circle is the set of points equidistant from a center. Circumference C = 2πr. Area A = πr². Arc length = (θ/360°) × 2πr. Sector area = (θ/360°) × πr². The tangent at any point is perpendicular to the radius at that point.',
};

function findRelevant(query: string): string {
  const q = query.toLowerCase();
  for (const key of Object.keys(KNOWLEDGE)) {
    if (q.includes(key)) return KNOWLEDGE[key];
  }
  // Try matching chapter names
  const chapter = FORMULAS.find((f) => q.includes(f.chapter.toLowerCase()));
  if (chapter) return `This topic covers ${chapter.chapter}. Key formula: ${chapter.formula}. ${chapter.description}`;
  return 'I can help with Class 10 topics: Quadratic Equations, Trigonometry, Electricity, Chemical Reactions, Acids & Bases, Carbon, Light, Magnetism, Probability, Statistics, Arithmetic Progressions, Circles, and more. Try asking about a specific concept!';
}

function generateQuiz(topic: string) {
  const relevant = FORMULAS.filter((f) => topic.toLowerCase().includes(f.chapter.toLowerCase()) || topic.toLowerCase().includes(f.subject.toLowerCase())).slice(0, 5);
  if (relevant.length === 0) return FORMULAS.slice(0, 5).map((f) => ({ q: `What is the formula for ${f.name}?`, a: f.formula }));
  return relevant.map((f) => ({ q: `What is the formula for ${f.name} (${f.chapter})?`, a: f.formula }));
}

function generateFlashcards(topic: string) {
  const relevant = FORMULAS.filter((f) => !topic || topic.toLowerCase().includes(f.chapter.toLowerCase()) || topic.toLowerCase().includes(f.subject.toLowerCase())).slice(0, 8);
  return relevant.map((f) => ({ front: f.name, back: f.formula }));
}

function summarizeChapter(topic: string) {
  const sheets = CHEAT_SHEETS.filter((c) => !topic || c.chapter.toLowerCase().includes(topic.toLowerCase()) || c.subject.toLowerCase().includes(topic.toLowerCase()));
  if (sheets.length === 0) return 'Enter a chapter name to get a summary with key formulas, shortcuts, and tips.';
  const sheet = sheets[0];
  return `**${sheet.chapter}** (${sheet.subject})\n\n**Key Formulas:**\n${sheet.formulas.map((f) => `• ${f}`).join('\n')}\n\n**Shortcuts:**\n${sheet.shortcuts.map((s) => `• ${s}`).join('\n')}\n\n**Tricks:**\n${sheet.tricks.map((t) => `• ${t}`).join('\n')}\n\n**Tips:**\n${sheet.tips.map((t) => `• ${t}`).join('\n')}`;
}

function generatePlan(days: number) {
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Social Science', 'English'];
  const plan: { day: number; subject: string; task: string }[] = [];
  for (let i = 1; i <= days; i++) {
    const subj = subjects[(i - 1) % subjects.length];
    const tasks = ['Revise key formulas', 'Practice NCERT exercises', 'Solve sample paper', 'Review cheat sheet', 'Take a quiz', 'Make flashcards'];
    plan.push({ day: i, subject: subj, task: tasks[(i - 1) % tasks.length] });
  }
  return plan;
}

export default function AIAssistant() {
  const { addXp } = useStore();
  const [tool, setTool] = useState<Tool>('doubt');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});

  const run = () => {
    if (!input.trim()) return;
    const userMsg: Msg = { role: 'user', content: input };
    let aiMsg: Msg = { role: 'ai', content: '' };

    if (tool === 'doubt') {
      aiMsg = { role: 'ai', content: findRelevant(input) };
    } else if (tool === 'quiz') {
      const quiz = generateQuiz(input);
      aiMsg = { role: 'ai', content: 'Here\'s your quiz. Try to answer each, then reveal:', data: quiz };
    } else if (tool === 'explain') {
      aiMsg = { role: 'ai', content: findRelevant(input) };
    } else if (tool === 'flashcards') {
      const cards = generateFlashcards(input);
      aiMsg = { role: 'ai', content: `Generated ${cards.length} flashcards:`, data: cards };
    } else if (tool === 'summarize') {
      aiMsg = { role: 'ai', content: summarizeChapter(input) };
    } else if (tool === 'plan') {
      const days = parseInt(input) || 7;
      aiMsg = { role: 'ai', content: `Here\'s your ${days}-day revision plan:`, data: generatePlan(days) };
    }

    setMessages((m) => [...m, userMsg, aiMsg]);
    setInput('');
    addXp(5);
  };

  const currentTool = TOOLS.find((t) => t.id === tool)!;

  return (
    <div className="space-y-6">
      <SectionTitle title="AI Assistant" subtitle="Your personal study companion" icon={<Icons.Bot size={24} />} />

      <GlassCard className="p-4 flex items-center gap-3">
        <Icons.Sparkles size={18} className="text-[rgb(var(--accent-soft))] flex-shrink-0" />
        <p className="text-sm text-secondary-c">Powered by a built-in Class 10 knowledge base. Ask about any topic, generate quizzes, flashcards, summaries, and revision plans. Earn 5 XP per interaction.</p>
      </GlassCard>

      {/* Tool selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {TOOLS.map((t) => {
          const Icon = iconMap[t.icon] || Icons.Circle;
          return (
            <button key={t.id} onClick={() => { setTool(t.id); setMessages([]); }} className={`glass card-hover rounded-xl p-4 text-center transition-all ${tool === t.id ? 'neon-border' : ''}`}>
              <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: `${t.color}20`, border: `1px solid ${t.color}40` }}>
                <Icon size={18} style={{ color: t.color }} />
              </div>
              <div className="text-xs font-semibold text-primary-c">{t.name}</div>
              <div className="text-[10px] text-muted-c">{t.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Input */}
      <GlassCard className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && run()}
            placeholder={tool === 'plan' ? 'Number of days (e.g. 7)' : tool === 'summarize' ? 'Chapter name (e.g. Electricity)' : 'Ask about any Class 10 topic...'}
            className="flex-1 bg-base-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-primary-c placeholder:text-muted-c focus:outline-none focus:border-[rgba(var(--accent),0.5)]"
          />
          <NeonButton onClick={run} className="!px-6"><Icons.Send size={16} /> Generate</NeonButton>
        </div>
      </GlassCard>

      {/* Messages */}
      {messages.length === 0 ? (
        <EmptyState icon={<Icons.Bot size={48} />} title={`AI ${currentTool.name}`} subtitle="Type your query above and hit Generate" />
      ) : (
        <div className="space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`glass rounded-2xl p-4 max-w-2xl ${m.role === 'user' ? 'neon-border' : ''}`}>
                <div className="flex items-center gap-2 mb-2">
                  {m.role === 'user' ? <Icons.User size={14} className="text-[rgb(var(--accent-soft))]" /> : <Icons.Bot size={14} className="text-[rgb(var(--accent-soft))]" />}
                  <span className="text-xs text-muted-c uppercase tracking-wider">{m.role === 'user' ? 'You' : 'AI'}</span>
                </div>
                <div className="text-sm text-secondary-c whitespace-pre-wrap leading-relaxed">{m.content}</div>
                {Array.isArray(m.data) && m.data.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {tool === 'quiz' && (m.data as { q: string; a: string }[]).map((item, j) => (
                      <div key={j} className="glass rounded-lg p-3">
                        <div className="text-sm font-medium text-primary-c">{j + 1}. {item.q}</div>
                        <button onClick={() => setQuizAnswers((a) => ({ ...a, [i * 100 + j]: item.a }))} className="text-xs neon-btn rounded px-2 py-1 mt-2">
                          {quizAnswers[i * 100 + j] ? `Answer: ${quizAnswers[i * 100 + j]}` : 'Reveal answer'}
                        </button>
                      </div>
                    ))}
                    {tool === 'flashcards' && (m.data as { front: string; back: string }[]).map((card, j) => (
                      <div key={j} className="glass rounded-lg p-3 flex justify-between items-center">
                        <span className="text-sm text-primary-c">{card.front}</span>
                        <span className="text-xs font-mono text-[rgb(var(--accent-soft))]">{card.back}</span>
                      </div>
                    ))}
                    {tool === 'plan' && (m.data as { day: number; subject: string; task: string }[]).map((p, j) => (
                      <div key={j} className="glass rounded-lg p-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg neon-border flex items-center justify-center text-xs font-bold text-[rgb(var(--accent-soft))]">{p.day}</div>
                        <div className="flex-1"><span className="text-sm text-primary-c font-medium">{p.subject}</span><span className="text-xs text-secondary-c ml-2">· {p.task}</span></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
