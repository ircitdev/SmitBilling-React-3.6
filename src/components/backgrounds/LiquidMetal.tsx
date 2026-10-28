import React, { useRef } from 'react';
import { useCanvasBackground, useThemeInk } from './useCanvasBackground';

/**
 * Фон «Графа знаний»: переливающиеся волны, похожие на жидкий металл.
 *
 * Несколько наложенных синусоид разной частоты дают полосы, которые медленно
 * перетекают друг в друга. Рисуется в низком разрешении и растягивается — так
 * получается мягкая заливка без тяжёлых расчётов на каждый пиксель.
 */
/** Во сколько раз рисуем мельче холста (дальше растягиваем). */
const SCALE = 5;

export default function LiquidMetal({ className = '' }: { className?: string }) {
  const dark = useThemeInk();
  // Холст для мелкого кадра и буфер пикселей создаём один раз: создавать их
  // на каждом кадре — значит отдавать сборщику мусора по холсту в кадр.
  const tmpRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<ImageData | null>(null);

  const { canvasRef } = useCanvasBackground({
    draw: (ctx, t, w, h) => {
      const cw = Math.max(2, Math.ceil(w / SCALE));
      const ch = Math.max(2, Math.ceil(h / SCALE));

      if (!tmpRef.current) tmpRef.current = document.createElement('canvas');
      const tmp = tmpRef.current;
      if (tmp.width !== cw || tmp.height !== ch) {
        tmp.width = cw;
        tmp.height = ch;
        imgRef.current = null;
      }
      if (!imgRef.current) imgRef.current = ctx.createImageData(cw, ch);
      const img = imgRef.current;
      const data = img.data;
      const isDark = dark.current;

      // фирменный зелёный: тёмная тема — насыщеннее, светлая — прозрачнее
      const r0 = isDark ? 16 : 209;
      const g0 = isDark ? 185 : 250;
      const b0 = isDark ? 129 : 229;
      const maxA = isDark ? 96 : 120;

      for (let y = 0; y < ch; y++) {
        for (let x = 0; x < cw; x++) {
          const u = x / cw;
          const v = y / ch;
          // три волны с разными периодами — от их наложения идут разводы
          const a = Math.sin((u * 6.0 + t * 0.45));
          const b = Math.sin((v * 5.0 - t * 0.33));
          const c = Math.sin(((u + v) * 4.2 + t * 0.6));
          // сводим в 0..1 и поджимаем, чтобы светлые пятна были уже тёмных
          let k = (a + b + c) / 3;
          k = (k + 1) / 2;
          k = k * k;

          const i = (y * cw + x) * 4;
          data[i] = r0;
          data[i + 1] = g0;
          data[i + 2] = b0;
          data[i + 3] = Math.round(k * maxA);
        }
      }

      // рисуем мелкий кадр и растягиваем — края волн получаются мягкими
      ctx.clearRect(0, 0, w, h);
      const tctx = tmp.getContext('2d');
      if (!tctx) return;
      tctx.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(tmp, 0, 0, w, h);
    },
  });

  return (
    <div
      aria-hidden="true"
      className={'pointer-events-none absolute inset-0 overflow-hidden -z-10 ' + className}
      style={{
        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 82%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 82%)',
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
