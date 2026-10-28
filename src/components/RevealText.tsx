import React, { useEffect, useRef } from 'react';

/**
 * Заголовок, который проявляется по буквам.
 *
 * Текст разбивается на символы, и каждый выходит с небольшой задержкой —
 * фраза как будто набирается. Делается один раз при появлении на экране.
 *
 * Разметка внутри (выделения цветом, переносы) сохраняется: разбиваем только
 * текстовые узлы, не трогая вложенные элементы. Для чтения с экрана текст
 * остаётся обычным — каждая буква помечена как оформление, а весь заголовок
 * читается целиком через aria-label.
 */
interface Props {
  children: React.ReactNode;
  className?: string;
  /** Задержка между буквами, мс. */
  step?: number;
  /** Не разбивать, если человек попросил не анимировать. */
  as?: 'h1' | 'h2' | 'div';
}

export default function RevealText({
  children,
  className = '',
  step = 18,
  as = 'div',
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Разбиваем на буквы только текстовые узлы: вложенные <span> с цветом
    // и переносами должны остаться как есть.
    let n = 0;
    const walk = (node: Node) => {
      const kids = Array.from(node.childNodes);
      for (const kid of kids) {
        if (kid.nodeType === Node.TEXT_NODE) {
          const text = kid.textContent || '';
          if (!text.trim()) continue;
          const frag = document.createDocumentFragment();
          // Каждое слово — отдельная обёртка: иначе строка переносится по
          // буквам и слово разрывается посередине.
          for (const word of text.split(/(\s+)/)) {
            if (!word) continue;
            if (/^\s+$/.test(word)) {
              frag.appendChild(document.createTextNode(word));
              continue;
            }
            const wrap = document.createElement('span');
            wrap.className = 'rv-word';
            for (const ch of word) {
              const sp = document.createElement('span');
              sp.textContent = ch;
              sp.className = 'rv-char';
              sp.style.animationDelay = `${n * step}ms`;
              n += 1;
              wrap.appendChild(sp);
            }
            frag.appendChild(wrap);
          }
          kid.parentNode?.replaceChild(frag, kid);
        } else if (kid.nodeType === Node.ELEMENT_NODE) {
          const el = kid as HTMLElement;
          // Текст, окрашенный градиентом (bg-clip-text), не разбиваем: у
          // каждой буквы получился бы свой градиент, и слово исчезало.
          // Такой элемент выходит целиком, одной анимацией.
          if (/text-transparent|bg-clip-text/.test(el.className || '')) {
            el.classList.add('rv-char');
            el.style.animationDelay = `${n * step}ms`;
            n += (el.textContent || '').length;
            continue;
          }
          walk(kid);
        }
      }
    };

    // Полный текст — для чтения с экрана: побуквенная разбивка ломает его.
    host.setAttribute('aria-label', host.textContent || '');
    walk(host);
    host.classList.add('rv-on');
  }, [step]);

  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
