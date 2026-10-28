import React, { useMemo } from 'react';
import { useCanvasBackground, useThemeInk } from './useCanvasBackground';

/**
 * Фон «Логической схемы» и «Аудиовыпуска»: сетка с падающими искрами.
 *
 * Ровная решётка задаёт ощущение схемы, а по ней изредка пролетают короткие
 * росчерки — как пакет, идущий по линии. Искры появляются по одной и редко,
 * иначе фон начинает мельтешить и отвлекать от содержимого.
 */
interface Star {
  x: number; y: number; vx: number; vy: number; life: number; max: number;
}

/** Шаг решётки. */
const STEP = 46;
/** Сколько искр летит одновременно. */
const STARS = 3;

export default function ShootingStarsGrid({ className = '' }: { className?: string }) {
  const dark = useThemeInk();
  const stars = useMemo<Star[]>(() => [], []);

  const spawn = (s: Star, w: number, h: number) => {
    // летят по диагонали сверху вниз, начиная выше верхнего края
    s.x = Math.random() * w * 1.2 - w * 0.1;
    s.y = -20 - Math.random() * h * 0.4;
    const speed = 5 + Math.random() * 4;
    s.vx = speed * 0.55;
    s.vy = speed;
    s.max = 60 + Math.random() * 60;
    s.life = 0;
  };

  const { canvasRef } = useCanvasBackground({
    draw: (ctx, t, w, h) => {
      if (stars.length !== STARS) {
        stars.length = 0;
        for (let i = 0; i < STARS; i++) {
          const s: Star = { x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 0 };
          spawn(s, w, h);
          // разводим по времени, иначе все три стартуют разом
          s.life = Math.random() * s.max;
          stars.push(s);
        }
      }

      ctx.clearRect(0, 0, w, h);
      const isDark = dark.current;
      const ink = isDark ? '110, 231, 183' : '16, 122, 87';

      // ── решётка ──────────────────────────────────────────────────────────
      ctx.strokeStyle = `rgba(${ink}, ${isDark ? 0.085 : 0.075})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = STEP / 2; x < w; x += STEP) {
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, h);
      }
      for (let y = STEP / 2; y < h; y += STEP) {
        ctx.moveTo(0, Math.round(y) + 0.5);
        ctx.lineTo(w, Math.round(y) + 0.5);
      }
      ctx.stroke();

      // узлы на пересечениях — чтобы решётка читалась как схема
      ctx.fillStyle = `rgba(${ink}, ${isDark ? 0.2 : 0.16})`;
      for (let x = STEP / 2; x < w; x += STEP) {
        for (let y = STEP / 2; y < h; y += STEP) {
          ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
        }
      }

      // ── искры ────────────────────────────────────────────────────────────
      ctx.lineCap = 'round';
      for (const s of stars) {
        s.life += 1;
        s.x += s.vx;
        s.y += s.vy;
        if (s.life > s.max || s.y > h + 40 || s.x > w + 40) {
          spawn(s, w, h);
          continue;
        }
        // хвост: короткий отрезок назад по направлению движения
        const tail = 26;
        const x2 = s.x - s.vx * (tail / Math.hypot(s.vx, s.vy));
        const y2 = s.y - s.vy * (tail / Math.hypot(s.vx, s.vy));

        // гаснет к началу и к концу жизни
        const k = Math.sin((s.life / s.max) * Math.PI);
        const grad = ctx.createLinearGradient(s.x, s.y, x2, y2);
        grad.addColorStop(0, `rgba(${ink}, ${(0.85 * k).toFixed(3)})`);
        grad.addColorStop(1, `rgba(${ink}, 0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // головка искры
        ctx.fillStyle = `rgba(${ink}, ${(0.9 * k).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    // без движения остаётся одна решётка — она и так осмысленная
    drawStatic: (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      const isDark = dark.current;
      const ink = isDark ? '110, 231, 183' : '16, 122, 87';
      ctx.strokeStyle = `rgba(${ink}, ${isDark ? 0.085 : 0.075})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = STEP / 2; x < w; x += STEP) {
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, h);
      }
      for (let y = STEP / 2; y < h; y += STEP) {
        ctx.moveTo(0, Math.round(y) + 0.5);
        ctx.lineTo(w, Math.round(y) + 0.5);
      }
      ctx.stroke();
    },
  });

  return (
    <div
      aria-hidden="true"
      className={'pointer-events-none absolute inset-0 overflow-hidden -z-10 ' + className}
      style={{
        maskImage: 'radial-gradient(ellipse at center, black 42%, transparent 86%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 42%, transparent 86%)',
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
