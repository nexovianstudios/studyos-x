import { useEffect, useRef } from 'react';
import { useStore, type EffectMode } from '../store';

export default function BackgroundEffects() {
  const { state } = useStore();
  const mode = state.preferences.effectMode;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const c = ctx;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    type P = { x: number; y: number; vx: number; vy: number; r: number; c: string; o: number };
    let particles: P[] = [];
    let matrixCols: number[] = [];

    const accent = state.preferences.accent || '#00d4ff';

    function initParticles() {
      const count = mode === 'minimal' ? 20 : mode === 'galaxy' ? 150 : 80;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 0.5,
        c: accent,
        o: Math.random() * 0.5 + 0.2,
      }));
    }

    function initRain() {
      particles = Array.from({ length: 150 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: Math.random() * 8 + 6,
        r: 1,
        c: '#aaccff',
        o: Math.random() * 0.4 + 0.2,
      }));
    }

    function initSnow() {
      particles = Array.from({ length: 100 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: Math.random() * 1 + 0.5,
        r: Math.random() * 3 + 1,
        c: '#ffffff',
        o: Math.random() * 0.6 + 0.3,
      }));
    }

    function initMatrix() {
      const cols = Math.floor(width / 14);
      matrixCols = Array.from({ length: cols }, () => Math.random() * -100);
    }

    function initCyberpunk() {
      particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        r: Math.random() * 3 + 1,
        c: Math.random() > 0.5 ? '#ff00ff' : '#00ffff',
        o: Math.random() * 0.6 + 0.3,
      }));
    }

    function initGalaxy() {
      particles = Array.from({ length: 200 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * Math.min(width, height) * 0.4;
        return {
          x: width / 2 + Math.cos(angle) * radius,
          y: height / 2 + Math.sin(angle) * radius,
          vx: -Math.sin(angle) * 0.3,
          vy: Math.cos(angle) * 0.3,
          r: Math.random() * 2 + 0.5,
          c: Math.random() > 0.7 ? '#ffffff' : accent,
          o: Math.random() * 0.8 + 0.2,
        };
      });
    }

    function drawParticles() {
      c.clearRect(0, 0, width, height);
      // connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            c.strokeStyle = `rgba(0, 212, 255, ${(1 - dist / 120) * 0.15})`;
            c.lineWidth = 0.5;
            c.beginPath();
            c.moveTo(particles[i].x, particles[i].y);
            c.lineTo(particles[j].x, particles[j].y);
            c.stroke();
          }
        }
      }
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        c.fillStyle = p.c;
        c.globalAlpha = p.o;
        c.beginPath();
        c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        c.fill();
      });
      c.globalAlpha = 1;
    }

    function drawRain() {
      c.clearRect(0, 0, width, height);
      c.strokeStyle = 'rgba(170, 204, 255, 0.4)';
      c.lineWidth = 1;
      particles.forEach((p) => {
        p.y += p.vy;
        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        c.beginPath();
        c.moveTo(p.x, p.y);
        c.lineTo(p.x - 1, p.y - 12);
        c.stroke();
      });
    }

    function drawSnow() {
      c.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx + Math.sin(p.y * 0.01) * 0.3;
        p.y += p.vy;
        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        c.fillStyle = `rgba(255,255,255,${p.o})`;
        c.beginPath();
        c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        c.fill();
      });
    }

    function drawMatrix() {
      c.fillStyle = 'rgba(5, 5, 7, 0.08)';
      c.fillRect(0, 0, width, height);
      c.fillStyle = '#00ff88';
      c.font = '14px monospace';
      matrixCols.forEach((y, i) => {
        const char = String.fromCharCode(0x30a0 + Math.random() * 96);
        c.fillText(char, i * 14, y);
        matrixCols[i] += 1.5;
        if (y > height && Math.random() > 0.975) matrixCols[i] = 0;
      });
    }

    function drawCyberpunk() {
      c.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        c.fillStyle = p.c;
        c.globalAlpha = p.o;
        c.shadowBlur = 15;
        c.shadowColor = p.c;
        c.beginPath();
        c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        c.fill();
      });
      c.globalAlpha = 1;
      c.shadowBlur = 0;
    }

    function drawGalaxy() {
      c.fillStyle = 'rgba(5, 5, 7, 0.1)';
      c.fillRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        const dx = p.x - width / 2;
        const dy = p.y - height / 2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > Math.min(width, height) * 0.45) {
          p.x = width / 2;
          p.y = height / 2;
        }
        c.fillStyle = p.c;
        c.globalAlpha = p.o;
        c.beginPath();
        c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        c.fill();
      });
      c.globalAlpha = 1;
    }

    function drawMinimal() {
      c.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        c.fillStyle = p.c;
        c.globalAlpha = p.o * 0.5;
        c.beginPath();
        c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        c.fill();
      });
      c.globalAlpha = 1;
    }

    const drawers: Record<EffectMode, () => void> = {
      none: () => c.clearRect(0, 0, width, height),
      particle: drawParticles,
      rain: drawRain,
      snow: drawSnow,
      matrix: drawMatrix,
      cyberpunk: drawCyberpunk,
      galaxy: drawGalaxy,
      minimal: drawMinimal,
    };

    const inits: Record<EffectMode, () => void> = {
      none: () => {},
      particle: initParticles,
      rain: initRain,
      snow: initSnow,
      matrix: initMatrix,
      cyberpunk: initCyberpunk,
      galaxy: initGalaxy,
      minimal: initParticles,
    };

    inits[mode]();

    const animate = () => {
      drawers[mode]();
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [mode, state.preferences.accent]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity: mode === 'none' ? 0 : 1 }}
    />
  );
}
