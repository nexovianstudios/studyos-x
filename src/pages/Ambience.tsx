import { useEffect, useRef, useState } from 'react';
import * as Icons from 'lucide-react';
import { GlassCard, SectionTitle } from '../components/ui';

interface Sound {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const SOUNDS: Sound[] = [
  { id: 'lofi', name: 'Lo-Fi', icon: 'Music', color: '#a78bfa' },
  { id: 'rain', name: 'Rain', icon: 'CloudRain', color: '#00d4ff' },
  { id: 'thunder', name: 'Thunder', icon: 'CloudLightning', color: '#9ca3af' },
  { id: 'cafe', name: 'Cafe', icon: 'Coffee', color: '#d97706' },
  { id: 'whitenoise', name: 'White Noise', icon: 'Radio', color: '#22f5ff' },
  { id: 'forest', name: 'Forest', icon: 'Trees', color: '#00ff9d' },
  { id: 'fireplace', name: 'Fireplace', icon: 'Flame', color: '#ff6b35' },
];

const iconMap = Icons as unknown as Record<string, Icons.LucideIcon>;

export default function Ambience() {
  const [active, setActive] = useState<Record<string, number>>({});
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<Record<string, { gain: GainNode; sources: AudioNode[] }>>({});

  useEffect(() => {
    return () => {
      Object.values(nodesRef.current).forEach(({ sources }) => sources.forEach((s) => { try { s.disconnect(); } catch { /* noop */ } }));
      audioCtxRef.current?.close();
    };
  }, []);

  const getCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioCtxRef.current;
  };

  const createNoise = (ctx: AudioContext, type: 'white' | 'brown' | 'pink' = 'white') => {
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'brown') {
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      } else {
        data[i] = white;
      }
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  };

  const startSound = (id: string) => {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();
    const gain = ctx.createGain();
    gain.gain.value = (active[id] ?? 0.5);
    gain.connect(ctx.destination);
    const sources: AudioNode[] = [];

    if (id === 'rain') {
      const noise = createNoise(ctx, 'white');
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2000;
      noise.connect(filter); filter.connect(gain);
      noise.start();
      sources.push(noise, filter);
    } else if (id === 'thunder') {
      const noise = createNoise(ctx, 'brown');
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 100;
      noise.connect(filter); filter.connect(gain);
      noise.start();
      // periodic rumble
      const rumble = setInterval(() => {
        const burst = createNoise(ctx, 'brown');
        const bf = ctx.createBiquadFilter();
        bf.type = 'lowpass'; bf.frequency.value = 80;
        const bg = ctx.createGain();
        bg.gain.setValueAtTime(0, ctx.currentTime);
        bg.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.1);
        bg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
        burst.connect(bf); bf.connect(bg); bg.connect(gain);
        burst.start(); burst.stop(ctx.currentTime + 2);
      }, 8000);
      sources.push(noise, filter);
      (sources as unknown as { _rumble: ReturnType<typeof setInterval> })._rumble = rumble;
    } else if (id === 'whitenoise') {
      const noise = createNoise(ctx, 'white');
      noise.connect(gain);
      noise.start();
      sources.push(noise);
    } else if (id === 'cafe') {
      const noise = createNoise(ctx, 'pink');
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 500;
      filter.Q.value = 0.5;
      noise.connect(filter); filter.connect(gain);
      noise.start();
      sources.push(noise, filter);
    } else if (id === 'forest') {
      // bird chirps via oscillators
      const chirp = () => {
        const osc = ctx.createOscillator();
        const og = ctx.createGain();
        osc.frequency.setValueAtTime(2000 + Math.random() * 2000, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.1);
        og.gain.setValueAtTime(0, ctx.currentTime);
        og.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
        og.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(og); og.connect(gain);
        osc.start(); osc.stop(ctx.currentTime + 0.2);
      };
      const interval = setInterval(() => { if (Math.random() > 0.4) chirp(); }, 1500);
      const noise = createNoise(ctx, 'pink');
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass'; filter.frequency.value = 3000;
      noise.connect(filter); filter.connect(gain);
      noise.start();
      sources.push(noise, filter);
      (sources as unknown as { _chirp: ReturnType<typeof setInterval> })._chirp = interval;
    } else if (id === 'fireplace') {
      const noise = createNoise(ctx, 'brown');
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600;
      noise.connect(filter); filter.connect(gain);
      noise.start();
      // crackle
      const crackle = setInterval(() => {
        const burst = createNoise(ctx, 'white');
        const bf = ctx.createBiquadFilter();
        bf.type = 'highpass'; bf.frequency.value = 2000;
        const bg = ctx.createGain();
        bg.gain.setValueAtTime(0.3, ctx.currentTime);
        bg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        burst.connect(bf); bf.connect(bg); bg.connect(gain);
        burst.start(); burst.stop(ctx.currentTime + 0.06);
      }, 300);
      sources.push(noise, filter);
      (sources as unknown as { _crackle: ReturnType<typeof setInterval> })._crackle = crackle;
    } else if (id === 'lofi') {
      // simple chord pad
      const freqs = [220, 277, 330];
      freqs.forEach((f) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = f;
        const og = ctx.createGain();
        og.gain.value = 0.08;
        osc.connect(og); og.connect(gain);
        osc.start();
        sources.push(osc, og);
      });
    }

    nodesRef.current[id] = { gain, sources };
    setActive((a) => ({ ...a, [id]: a[id] ?? 0.5 }));
  };

  const stopSound = (id: string) => {
    const node = nodesRef.current[id];
    if (!node) return;
    node.sources.forEach((s) => {
      try {
        const r = s as unknown as { _rumble?: number; _chirp?: number; _crackle?: number; stop?: () => void };
        if (r._rumble) clearInterval(r._rumble);
        if (r._chirp) clearInterval(r._chirp);
        if (r._crackle) clearInterval(r._crackle);
        if (r.stop) r.stop();
        s.disconnect();
      } catch { /* noop */ }
    });
    delete nodesRef.current[id];
    setActive((a) => { const n = { ...a }; delete n[id]; return n; });
  };

  const setVolume = (id: string, vol: number) => {
    const node = nodesRef.current[id];
    if (node) node.gain.gain.value = vol;
    setActive((a) => ({ ...a, [id]: vol }));
  };

  const toggle = (id: string) => {
    if (active[id] !== undefined) stopSound(id);
    else startSound(id);
  };

  return (
    <div className="space-y-6">
      <SectionTitle title="Ambience Center" subtitle="Mix multiple sounds for the perfect study atmosphere" icon={<Icons.Music size={24} />} />

      <GlassCard className="p-4 flex items-center gap-3">
        <Icons.Info size={18} className="text-[rgb(var(--accent-soft))] flex-shrink-0" />
        <p className="text-sm text-secondary-c">Click a sound to start it. Adjust volume with the slider. Mix multiple sounds together for a custom ambience. Audio is synthesized in-browser — no downloads needed.</p>
      </GlassCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SOUNDS.map((s) => {
          const Icon = iconMap[s.icon] || Icons.Circle;
          const isActive = active[s.id] !== undefined;
          const vol = active[s.id] ?? 0.5;
          return (
            <GlassCard key={s.id} hover className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${s.color}20`, border: `1px solid ${s.color}50`, boxShadow: isActive ? `0 0 15px ${s.color}40` : 'none' }}>
                    <Icon size={22} style={{ color: s.color }} />
                  </div>
                  <div>
                    <div className="font-semibold text-primary-c">{s.name}</div>
                    <div className="text-xs text-muted-c">{isActive ? 'Playing' : 'Tap to play'}</div>
                  </div>
                </div>
                <button onClick={() => toggle(s.id)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isActive ? 'neon-btn' : 'glass'}`}>
                  {isActive ? <Icons.Square size={16} /> : <Icons.Play size={16} />}
                </button>
              </div>
              {isActive && (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-2">
                    <Icons.Volume1 size={14} className="text-muted-c" />
                    <input type="range" min="0" max="1" step="0.05" value={vol} onChange={(e) => setVolume(s.id, +e.target.value)} className="flex-1" />
                    <Icons.Volume2 size={14} className="text-muted-c" />
                  </div>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      {Object.keys(active).length > 0 && (
        <GlassCard className="p-4 flex items-center justify-between">
          <div className="text-sm text-secondary-c">{Object.keys(active).length} sound(s) active</div>
          <button onClick={() => Object.keys(active).forEach(stopSound)} className="text-xs neon-btn rounded-lg px-3 py-1.5 flex items-center gap-1.5">
            <Icons.X size={14} /> Stop All
          </button>
        </GlassCard>
      )}
    </div>
  );
}
