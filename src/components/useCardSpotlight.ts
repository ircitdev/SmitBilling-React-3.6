import { useEffect } from 'react';

/**
 * Подсветка карточек, идущая за курсором.
 *
 * Сам рисунок делает CSS (.card-spot), а координаты курсора берутся отсюда:
 * обработчик один на страницу и пишет их в переменные --mx/--my той карточки,
 * над которой курсор. Вешать слушатель на каждую карточку было бы дороже —
 * их на странице больше полусотни.
 *
 * На телефоне курсора нет, поэтому там обработчик не ставится вовсе.
 */
export function useCardSpotlight() {
  useEffect(() => {
    // тонкое перо и мышь дают hover; у пальца его нет
    if (!window.matchMedia('(hover: hover)').matches) return;

    let frame = 0;
    let pending: { el: HTMLElement; x: number; y: number } | null = null;

    const flush = () => {
      frame = 0;
      if (!pending) return;
      const { el, x, y } = pending;
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
      pending = null;
    };

    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.('.card-spot') as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      pending = { el, x: e.clientX - r.left, y: e.clientY - r.top };
      // координаты пишем раз в кадр: без этого при быстром движении курсора
      // страница пересчитывает стили десятки раз подряд
      if (!frame) frame = requestAnimationFrame(flush);
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
}
