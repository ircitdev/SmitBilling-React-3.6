import React, { useMemo } from 'react';
import { useCanvasBackground, useThemeInk } from './useCanvasBackground';

/**
 * Фон первого экрана: вращающаяся сфера из треугольной сетки.
 *
 * Точки разложены по сфере, соседние соединены рёбрами; вся фигура медленно
 * поворачивается, а курсор слегка доворачивает её. Сфера крупнее экрана и
 * уходит за правый край — слева остаётся место под заголовок и кнопки.
 *
 * Дальняя половина рисуется бледнее ближней, поэтому каркас читается как
 * объём, а не как плоская паутина.
 */
interface Vertex { x: number; y: number; z: number }

/** Сколько точек на сфере. Больше — плотнее каркас и дороже отрисовка. */
const COUNT = 150;
/** Соседи ближе этого расстояния (в долях радиуса) соединяются ребром. */
const LINK = 0.46;

/**
 * Точки, разложенные по сфере «подсолнухом»: золотой угол даёт равномерную
 * раскладку без сгущения у полюсов, как вышло бы при случайных координатах.
 */
function makeSphere(n: number): Vertex[] {
  const out: Vertex[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = golden * i;
    out.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r });
  }
  return out;
}

export default function TopologyField({ className = '' }: { className?: string }) {
  const dark = useThemeInk();

  // Каркас считается один раз: раскладка и список рёбер не меняются, каждый
  // кадр их только поворачивает.
  const { verts, edges } = useMemo(() => {
    const v = makeSphere(COUNT);
    const e: Array<[number, number]> = [];
    for (let i = 0; i < v.length; i++) {
      for (let j = i + 1; j < v.length; j++) {
        const dx = v[i].x - v[j].x;
        const dy = v[i].y - v[j].y;
        const dz = v[i].z - v[j].z;
        if (dx * dx + dy * dy + dz * dz < LINK * LINK) e.push([i, j]);
      }
    }
    return { verts: v, edges: e };
  }, []);

  const { canvasRef, pointerRef } = useCanvasBackground({
    pointer: true,
    draw: (ctx, t, w, h) => {
      ctx.clearRect(0, 0, w, h);

      const isDark = dark.current;
      // На тёмной теме каркас светлый, на светлой — фирменный зелёный:
      // светлые линии на белом фоне просто не видны.
      const ink = isDark ? '226, 240, 234' : '16, 122, 87';
      // На телефоне каркас заметнее по толщине, поэтому приглушаем его —
      // иначе он спорит с текстом поверх.
      const narrowInk = w < 640 ? 0.55 : 1;
      // Каркас был почти не виден: на десктопе его съедала и маска, и низкая
      // насыщенность. Линии ярче, узлы плотнее.
      const edgeMax = (isDark ? 0.5 : 0.4) * narrowInk;
      const dotMax = (isDark ? 1 : 0.85) * narrowInk;

      // На узком экране сфера целиком не поместилась бы, поэтому там она
      // меньше и поднята — виден и нижний край. На десктопе крупнее экрана и
      // сдвинута вправо: слева остаётся место под заголовок.
      const narrow = w < 640;
      // На десктопе сфера умещается по высоте целиком, включая нижний край;
      // раньше она была крупнее экрана и обрезалась.
      // Сфера целиком в видимой части: слева её гасит маска контейнера
      // (до 34% ширины), справа — край экрана. Поэтому центр ставим правее
      // середины погашенной зоны, а радиус — по свободному месту.
      const R = narrow ? Math.min(w, h) * 0.63 : Math.min(h * 0.69, w * 0.45);
      const cx = narrow ? w * 0.58 + 50 : w * 0.62 + 100;
      const cy = narrow ? h * 0.36 : h * 0.44 - 100;

      // поворот: постоянный дрейф плюс небольшой доворот за курсором
      const p = pointerRef.current;
      const mx = p.inside ? (p.x / w - 0.5) : 0;
      const my = p.inside ? (p.y / h - 0.5) : 0;
      const ay = t * 0.12 + mx * 0.5;
      const ax = Math.sin(t * 0.07) * 0.25 + my * 0.35;

      const cosY = Math.cos(ay);
      const sinY = Math.sin(ay);
      const cosX = Math.cos(ax);
      const sinX = Math.sin(ax);

      // поворачиваем и проецируем один раз за кадр
      const px: number[] = new Array(verts.length);
      const py: number[] = new Array(verts.length);
      const pz: number[] = new Array(verts.length);
      for (let i = 0; i < verts.length; i++) {
        const v = verts[i];
        // вокруг вертикали
        const x1 = v.x * cosY + v.z * sinY;
        const z1 = -v.x * sinY + v.z * cosY;
        // затем наклон
        const y2 = v.y * cosX - z1 * sinX;
        const z2 = v.y * sinX + z1 * cosX;
        px[i] = cx + x1 * R;
        py[i] = cy + y2 * R;
        pz[i] = z2; // −1 дальняя половина, +1 ближняя
      }

      // ── рёбра ────────────────────────────────────────────────────────────
      // На телефоне линии толще: при мелком каркасе волосяная линия рябит.
      ctx.lineWidth = narrow ? 1.6 : 1.2;
      for (const [i, j] of edges) {
        // глубина ребра — среднее его концов; дальние бледнее
        const depth = (pz[i] + pz[j]) / 2;
        const k = (depth + 1) / 2;            // 0 дальше, 1 ближе
        const a = edgeMax * (0.18 + k * 0.82);
        ctx.strokeStyle = `rgba(${ink}, ${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(px[i], py[i]);
        ctx.lineTo(px[j], py[j]);
        ctx.stroke();
      }

      // ── узлы ─────────────────────────────────────────────────────────────
      for (let i = 0; i < verts.length; i++) {
        const k = (pz[i] + 1) / 2;
        // ближние крупнее и ярче — от этого читается объём
        const r = 0.9 + k * 2.2;
        const a = dotMax * (0.12 + k * 0.88);
        ctx.fillStyle = `rgba(${ink}, ${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px[i], py[i], r, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  });

  return (
    <div
      aria-hidden="true"
      className={
        'tf-holder pointer-events-none absolute top-0 right-0 w-full ' +
        'h-[200vh] sm:h-auto sm:inset-y-0 sm:w-[68%] lg:w-[58%] ' +
        'z-0 ' + className
      }
      style={{
        // чем растворять край — задано в CSS (.tf-holder): на десктопе
        // слева, на телефоне снизу
        maskImage: 'var(--tf-mask)',
        WebkitMaskImage: 'var(--tf-mask)',
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
