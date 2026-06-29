import { useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import { useStore, type Note } from '../store';
import { GlassCard, SectionTitle, NeonButton, EmptyState, Modal } from '../components/ui';

const CATEGORIES = ['General', 'Math', 'Physics', 'Chemistry', 'Biology', 'Social', 'English', 'Ideas'];
const COLORS = ['#00d4ff', '#22f5ff', '#00ff9d', '#ffb800', '#ff3b6b', '#a78bfa', '#ff6b35', '#ffffff'];

export default function NotesHub() {
  const { state, setState } = useStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [editing, setEditing] = useState<Note | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const filtered = useMemo(() => {
    return state.notes.filter((n) => {
      if (category !== 'all' && n.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
      }
      return true;
    }).sort((a, b) => b.updatedAt - a.updatedAt);
  }, [state.notes, search, category]);

  const createNote = () => {
    const note: Note = {
      id: crypto.randomUUID(),
      title: 'Untitled Note',
      content: '',
      category: 'General',
      color: COLORS[0],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setEditing(note);
    setShowEditor(true);
  };

  const saveNote = (note: Note) => {
    setState((s) => {
      const exists = s.notes.find((n) => n.id === note.id);
      const updated = { ...note, updatedAt: Date.now() };
      return { ...s, notes: exists ? s.notes.map((n) => (n.id === note.id ? updated : n)) : [...s.notes, updated] };
    });
  };

  const deleteNote = (id: string) => setState((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== id) }));

  const renderMarkdown = (text: string) => {
    return text
      .replace(/^### (.*$)/gm, '<h3 class="text-base font-semibold text-primary-c mt-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-lg font-bold text-primary-c mt-2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold gradient-text mt-2">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary-c">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="font-mono text-[rgb(var(--accent-soft))] bg-base-3 px-1 rounded">$1</code>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 text-secondary-c">• $1</li>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionTitle title="Notes Hub" subtitle="Sticky notes with Markdown support" icon={<Icons.StickyNote size={24} />} />
        <NeonButton onClick={createNote}><Icons.Plus size={16} /> New Note</NeonButton>
      </div>

      <GlassCard className="p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Icons.Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-c" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes..." className="w-full bg-base-2 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-primary-c placeholder:text-muted-c focus:outline-none focus:border-[rgba(var(--accent),0.5)]" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setCategory('all')} className={`rounded-lg px-3 py-1.5 text-xs ${category === 'all' ? 'neon-btn' : 'glass text-secondary-c'}`}>All</button>
          {CATEGORIES.map((c) => <button key={c} onClick={() => setCategory(c)} className={`rounded-lg px-3 py-1.5 text-xs ${category === c ? 'neon-btn' : 'glasstext-secondary-c'}`}>{c}</button>)}
        </div>
      </GlassCard>

      {filtered.length === 0 ? (
        <EmptyState icon={<Icons.StickyNote size={48} />} title="No notes yet" subtitle="Create your first note to get started" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((note) => (
            <div key={note.id} className="rounded-2xl p-5 group cursor-pointer transition-all card-hover" style={{ background: `${note.color}10`, border: `1px solid ${note.color}30`, backdropFilter: 'blur(16px)' }} onClick={() => { setEditing(note); setShowEditor(true); }}>
              <div className="flex items-start justify-between mb-2">
                <div className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: `${note.color}30`, color: note.color }}>{note.category}</div>
                <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }} className="text-muted-c hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"><Icons.Trash2 size={14} /></button>
              </div>
              <h3 className="font-semibold text-primary-c mb-2 truncate">{note.title}</h3>
              <div className="text-sm text-secondary-c line-clamp-4 overflow-hidden" dangerouslySetInnerHTML={{ __html: renderMarkdown(note.content) || '<span class="text-muted-c italic">Empty note</span>' }} />
              <div className="text-[10px] text-muted-c mt-3">{new Date(note.updatedAt).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showEditor && !!editing} onClose={() => setShowEditor(false)} title="Edit Note">
        {editing && (
          <div className="space-y-4">
            <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Note title" className="w-full bg-base-2 border border-white/10 rounded-xl px-3 py-2 text-sm text-primary-c focus:outline-none focus:border-[rgba(var(--accent),0.5)]" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-secondary-c">Category</label>
                <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="w-full bg-base-2 border border-white/10 rounded-xl px-3 py-2 text-sm text-primary-c mt-1">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-secondary-c">Color</label>
                <div className="flex gap-1.5 mt-1 flex-wrap">
                  {COLORS.map((c) => <button key={c} onClick={() => setEditing({ ...editing, color: c })} className={`w-7 h-7 rounded-full transition-all ${editing.color === c ? 'ring-2 ring-white scale-110' : ''}`} style={{ background: c }} />)}
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs text-secondary-c">Content (Markdown supported)</label>
              <textarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} placeholder="# Heading&#10;**bold** *italic* `code`&#10;- list item" className="w-full bg-base-2 border border-white/10 rounded-xl p-3 text-sm text-primary-c placeholder:text-muted-c focus:outline-none focus:border-[rgba(var(--accent),0.5)] h-40 resize-none font-mono" />
            </div>
            <div className="glass rounded-xl p-3 max-h-32 overflow-y-auto">
              <div className="text-[10px] text-muted-c mb-1">Preview:</div>
              <div className="text-sm" dangerouslySetInnerHTML={{ __html: renderMarkdown(editing.content) || '<span class="text-muted-c italic">Nothing to preview</span>' }} />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowEditor(false)} className="glass rounded-xl px-4 py-2 text-sm text-secondary-c">Cancel</button>
              <NeonButton onClick={() => { saveNote(editing); setShowEditor(false); }}><Icons.Save size={16} /> Save</NeonButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
