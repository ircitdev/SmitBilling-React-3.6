import React, { useMemo } from 'react';
import { useCanvasBackground, useThemeInk } from './useCanvasBackground';

/**
 * Фон «Как это работает»: частицы, медленно плывущие вверх.
 *
 * Спокойное движение снизу вверх — под смысл секции, где три шага ведут от
 * установки к работающей системе. Курсор частицы слегка расталкивает.
 */
interface Dust { x: number; y: number; r: number; v: number; drift: number; a: number }

/** Сколько частиц держим. */
const COUNT = 70;

export default function ParticlesBg({ className = '' }: { className?: string }) {
  const dark = useThemeInk();
  const dust = useMemo<Dust[]>(() => [], []);

  const { canvasRef, pointerRef } = useCanvasBackground({
    pointer: true,
    draw: (ctx, t, w, h) => {
      if (dust.length !== COUNT) {
        dust.length = 0;
        for (let i = 0; i < COUNT; i++) {
          dust.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: 0.8 + Math.random() * 2.2,
            v: 0.12 + Math.random() * 0.4,
            drift: (Math.random() - 0.5) * 0.3,
            a: 0.25 + Math.random() * 0.5,
          });
        }
      }

      ctx.clearRect(0, 0, w, h);
      const isDark = dark.current;
      const ink = isDark ? '110, 231, 183' : '16, 122, 87';
      const scale = isDark ? 1 : 0.7; // на светлой теме глуше

      const p = pointerRef.current;

      for (const d of dust) {
        d.y -= d.v;
        d.x += d.drift + Math.sin(t * 0.5 + d.y * 0.01) * 0.12;

        // ушла за верх — возвращаем снизу
        if (d.y < -6) {
          d.y = h + 6;
          d.x = Math.random() * w;
        }
        if (d.x < -6) d.x = w + 6;
        if (d.x > w + 6) d.x = -6;

        let r = d.r;
        let a = d.a * scale;
        if (p.inside) {
          const dx = d.x - p.x;
          const dy = d.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 110) {
            const k = 1 - dist / 110;
            d.x += (dx / (dist || 1)) * k * 1.1;
            d.y += (dy / (dist || 1)) * k * 1.1;
            r += k * 1.2;
            a = Math.min(1, a + k * 0.4);
          }
        }

        ctx.fillStyle = `rgba(${ink}, ${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  });

  return (
    <div
      aria-hidden="true"
      className={'pointer-events-none absolute inset-0 overflow-hidden -z-10 ' + className}
      style={{
        maskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
