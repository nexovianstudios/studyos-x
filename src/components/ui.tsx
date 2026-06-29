import { type ReactNode } from 'react';

export function GlassCard({ children, className = '', hover = false }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={`glass rounded-2xl ${hover ? 'card-hover' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {icon && <div className="text-[rgb(var(--accent-soft))]">{icon}</div>}
      <div>
        <h2 className="font-display text-2xl font-bold gradient-text">{title}</h2>
        {subtitle && <p className="text-sm text-secondary-c mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

export function StatPill({ label, value, icon, accent }: { label: string; value: string | number; icon?: ReactNode; accent?: boolean }) {
  return (
    <div className={`glass rounded-xl px-4 py-3 flex items-center gap-3 ${accent ? 'neon-border' : ''}`}>
      {icon && <div className="text-[rgb(var(--accent-soft))]">{icon}</div>}
      <div>
        <div className="text-xs text-secondary-c uppercase tracking-wider">{label}</div>
        <div className="font-display text-lg font-bold text-primary-c">{value}</div>
      </div>
    </div>
  );
}

export function NeonButton({ children, onClick, className = '', type = 'button' }: { children: ReactNode; onClick?: () => void; className?: string; type?: 'button' | 'submit' }) {
  return (
    <button type={type} onClick={onClick} className={`neon-btn rounded-xl px-5 py-2.5 font-medium text-sm flex items-center gap-2 justify-center ${className}`}>
      {children}
    </button>
  );
}

export function ProgressBar({ value, max = 100, label, showValue = true }: { value: number; max?: number; label?: string; showValue?: boolean }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs text-secondary-c mb-1.5">
          <span>{label}</span>
          {showValue && <span className="text-[rgb(var(--accent-soft))]">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className="h-2 bg-base-3 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, rgb(var(--accent-dim)), rgb(var(--accent-soft)))',
            boxShadow: '0 0 10px rgba(var(--accent), 0.5)',
          }}
        />
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, subtitle }: { icon?: ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="text-[rgb(var(--accent))] opacity-40 mb-4">{icon}</div>}
      <h3 className="font-display text-lg font-semibold text-secondary-c">{title}</h3>
      {subtitle && <p className="text-sm text-muted-c mt-1">{subtitle}</p>}
    </div>
  );
}

export function Modal({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: ReactNode; title?: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="glass-strong rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        {title && <h3 className="font-display text-xl font-bold gradient-text mb-4">{title}</h3>}
        {children}
      </div>
    </div>
  );
}
