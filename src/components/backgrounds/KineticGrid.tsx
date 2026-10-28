import React from 'react';
import { useCanvasBackground, useThemeInk } from './useCanvasBackground';

/**
 * Фон «Финансового автопилота»: сетка, которая тянется к курсору.
 *
 * Точки стоят решёткой и слегка колышутся волной. Рядом с курсором решётка
 * прогибается — сетка выглядит упругой, а не нарисованной. Отсылка к тому, о
 * чём секция: поток платежей, который система разбирает сама.
 */
/** Шаг решётки в логических пикселях. */
const STEP = 34;
/** Радиус влияния курсора. */
const REACH = 150;
/** Насколько сильно решётка прогибается. */
const WARP = 22;

export default function KineticGrid({ className = '' }: { className?: string }) {
  const dark = useThemeInk();

  const { canvasRef, pointerRef } = useCanvasBackground({
    pointer: true,
    draw: (ctx, t, w, h) => {
      ctx.clearRect(0, 0, w, h);

      const isDark = dark.current;
      const ink = isDark ? '110, 231, 183' : '16, 122, 87';
      const base = isDark ? 0.22 : 0.16;
      const near = isDark ? 0.75 : 0.55;

      const p = pointerRef.current;

      for (let gx = STEP / 2; gx < w; gx += STEP) {
        for (let gy = STEP / 2; gy < h; gy += STEP) {
          // общая волна: сетка «дышит», даже когда курсора нет
          const wave = Math.sin(t * 0.9 + gx * 0.02 + gy * 0.016);
          let x = gx + wave * 1.6;
          let y = gy + Math.cos(t * 0.7 + gx * 0.018) * 1.6;
          let r = 1.1;
          let a = base;

          if (p.inside) {
            const dx = x - p.x;
            const dy = y - p.y;
            const d = Math.hypot(dx, dy);
            if (d < REACH) {
              const k = 1 - d / REACH;
              // точки расходятся от курсора — решётка прогибается
              const push = k * k * WARP;
              x += (dx / (d || 1)) * push;
              y += (dy / (d || 1)) * push;
              r += k * 1.7;
              a = base + (near - base) * k;
            }
          }

          ctx.fillStyle = `rgba(${ink}, ${a.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
  });

  return (
    <div
      aria-hidden="true"
      className={'pointer-events-none absolute inset-0 overflow-hidden -z-10 ' + className}
      style={{
        // к краям растворяем, чтобы сетка не обрывалась ровной линией
        maskImage: 'radial-gradient(ellipse at center, black 45%, transparent 85%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 45%, transparent 85%)',
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
