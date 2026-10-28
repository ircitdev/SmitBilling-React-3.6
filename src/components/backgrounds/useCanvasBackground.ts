import { useEffect, useRef } from 'react';

/**
 * Общая основа для анимированных фонов на canvas.
 *
 * Четыре фона на странице отличаются только рисованием, а служебная часть у
 * них одна: подгонка под размер блока и плотность экрана, цикл кадров,
 * остановка, когда блок ушёл с экрана (иначе четыре цикла крутятся
 * одновременно и греют устройство), и уважение к «уменьшить движение».
 *
 * Рисование приходит снаружи: draw(ctx, t, w, h) вызывается каждый кадр, где
 * t — секунды с начала, w и h — размеры в логических пикселях.
 */
export interface CanvasBackgroundOptions {
  /** Кадр анимации. */
  draw: (ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => void;
  /** Разовая отрисовка, когда анимация выключена («уменьшить движение»). */
  drawStatic?: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  /** Следить за курсором: в draw приходит через mouse. */
  pointer?: boolean;
}

export interface Pointer { x: number; y: number; inside: boolean }

export function useCanvasBackground(opts: CanvasBackgroundOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<Pointer>({ x: 0, y: 0, inside: false });
  // держим свежий draw, чтобы не перезапускать цикл на каждый рендер
  const drawRef = useRef(opts.draw);
  drawRef.current = opts.draw;
  const staticRef = useRef(opts.drawStatic);
  staticRef.current = opts.drawStatic;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;

    // Размер пересчитываем перед каждым кадром, если он изменился: замер
    // один раз при подписке давал устаревшие w/h — контейнер к тому моменту
    // ещё не получил окончательную ширину, и рисунок уезжал за границы
    // холста (масштаб расходился с devicePixelRatio).
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const nw = Math.max(1, Math.round(rect.width));
      const nh = Math.max(1, Math.round(rect.height));
      if (nw === w && nh === h) return;
      // на широких экранах вдвое больше пикселей ни к чему — держим до 2
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = nw;
      h = nh;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    let raf = 0;
    let running = false;
    let start = 0;

    const frame = (now: number) => {
      if (!running) return;
      if (!start) start = now;
      resize();
      drawRef.current(ctx, (now - start) / 1000, w, h);
      raf = requestAnimationFrame(frame);
    };

    const startLoop = () => {
      if (running) return;
      if (reduce.matches) {
        // движение выключено — рисуем один спокойный кадр
        (staticRef.current || ((c, cw, ch) => drawRef.current(c, 0, cw, ch)))(ctx, w, h);
        return;
      }
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const stopLoop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    // Рисуем сразу, не дожидаясь наблюдателя: фон живёт под содержимым, а
    // появление секций анимируется — в момент подписки элемент бывает скрыт,
    // наблюдатель решает «не в кадре», и цикл не стартует вовсе. Так и вышло:
    // все фоны молчали, хотя холсты были на своих местах.
    startLoop();

    // Дальше наблюдатель только останавливает фон, ушедший с экрана: иначе
    // пять фонов крутятся одновременно и греют устройство.
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? startLoop() : stopLoop()),
      { threshold: 0, rootMargin: '150px' },
    );
    io.observe(canvas);

    // вкладку свернули — тоже останавливаемся
    const onVisibility = () => (document.hidden ? stopLoop() : startLoop());
    document.addEventListener('visibilitychange', onVisibility);

    let onMove: ((e: PointerEvent) => void) | null = null;
    let onLeave: (() => void) | null = null;
    if (opts.pointer) {
      onMove = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        pointerRef.current = {
          x: e.clientX - r.left,
          y: e.clientY - r.top,
          inside: true,
        };
      };
      onLeave = () => { pointerRef.current.inside = false; };
      const host = canvas.parentElement || canvas;
      host.addEventListener('pointermove', onMove);
      host.addEventListener('pointerleave', onLeave);
    }

    const onReduceChange = () => { stopLoop(); startLoop(); };
    reduce.addEventListener('change', onReduceChange);

    return () => {
      stopLoop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      reduce.removeEventListener('change', onReduceChange);
      if (onMove || onLeave) {
        const host = canvas.parentElement || canvas;
        if (onMove) host.removeEventListener('pointermove', onMove);
        if (onLeave) host.removeEventListener('pointerleave', onLeave);
      }
    };
    // draw держим в ref, поэтому цикл не перезапускается на каждый рендер
  }, [opts.pointer]);

  return { canvasRef, pointerRef };
}

/**
 * Цвета фона под текущую тему.
 *
 * Фоны рисуются на canvas, поэтому CSS-переменные им недоступны — берём
 * фирменный зелёный и подбираем прозрачность так, чтобы на светлой теме
 * рисунок был заметен, но не спорил с текстом, а на тёмной — не слепил.
 */
export function useThemeInk() {
  const darkRef = useRef(false);

  useEffect(() => {
    const read = () => {
      darkRef.current = document.documentElement.classList.contains('dark');
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, []);

  return darkRef;
}
