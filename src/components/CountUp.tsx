import React, { useEffect, useRef, useState } from 'react';

/**
 * Число, которое досчитывается от нуля, когда карточка появляется на экране.
 *
 * Значение приходит строкой вида «6 300+», «73%», «15 мин» — разбираем её на
 * приставку, число и хвост, считаем только число, остальное оставляем как
 * есть. Если числа в строке нет, показываем её без изменений.
 *
 * Считается один раз: повторные проходы мимо карточки не перезапускают счёт,
 * иначе цифры дёргались бы при каждой прокрутке.
 */
interface Props {
  value: string;
  className?: string;
  /** Сколько длится счёт, мс. */
  duration?: number;
}

/** Разбирает «6 300+» на «», 6300, «+». */
function parse(value: string) {
  // пробелы внутри числа — разрядные (в том числе неразрывные)
  const m = value.match(/^([^\d]*)([\d\s ]+(?:[.,]\d+)?)(.*)$/);
  if (!m) return null;
  const digits = m[2].replace(/[\s ]/g, '').replace(',', '.');
  const n = parseFloat(digits);
  if (!isFinite(n)) return null;
  // сколько знаков после запятой показывать
  const dot = digits.indexOf('.');
  return {
    head: m[1],
    target: n,
    tail: m[3],
    decimals: dot === -1 ? 0 : digits.length - dot - 1,
    grouped: /[\s ]/.test(m[2]),
  };
}

export default function CountUp({ value, className = '', duration = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    const parts = parse(value);
    if (!el || !parts) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let done = false;
    let raf = 0;

    const format = (n: number) => {
      const s = parts.decimals
        ? n.toFixed(parts.decimals)
        : String(Math.round(n));
      // разрядные пробелы возвращаем, если они были в исходном значении
      const withSpaces = parts.grouped
        ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
        : s;
      return parts.head + withSpaces + parts.tail;
    };

    const run = () => {
      if (done) return;
      done = true;
      const start = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - start) / duration);
        // замедление к концу: счёт выглядит как остановка, а не обрыв
        const eased = 1 - Math.pow(1 - k, 3);
        setShown(format(parts.target * eased));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      setShown(format(0));
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { run(); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(el);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return <span ref={ref} className={className}>{shown}</span>;
}
