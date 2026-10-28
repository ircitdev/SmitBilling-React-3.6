import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Появление секции: заголовок, текст и карточки выходят друг за другом, когда
 * секция подходит к экрану.
 *
 * Сделано одной обёрткой на все секции, а не анимацией внутри каждой: так
 * ритм появления одинаковый по всей странице, и выключается он тоже в одном
 * месте. Порядок задаётся разметкой — что выше в DOM, то и выходит раньше.
 *
 * Уважает «уменьшить движение»: при этой настройке содержимое просто стоит на
 * месте, без анимации.
 */
interface Props {
  children: React.ReactNode;
  /** Анимировать сразу при загрузке, не дожидаясь прокрутки (для первого экрана). */
  immediate?: boolean;
}

/** Что именно выходит по очереди внутри секции. */
const TARGETS = [
  'h1', 'h2', 'h3',
  '[data-reveal]',
  '[data-reveal-group] > *',
].join(',');

/** Доля экрана, на которой секция считается подошедшей. */
const START = 0.85;

export default function Reveal({ children, immediate = false }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = root.current;
    if (!el) return;

    // Человек попросил систему не анимировать — не анимируем.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const found: HTMLElement[] = Array.from(el.querySelectorAll<HTMLElement>(TARGETS));
    const items = found
      // Заголовок, который проявляется по буквам, ведёт себя сам —
      // иначе две анимации накладываются и он мигает.
      .filter((n) => !n.classList.contains('rv-on'))
      // вложенные заголовки внутри уже анимируемой группы не дублируем
      .filter((n) => !n.parentElement?.closest('[data-reveal-group]') ||
                     n.matches('[data-reveal-group] > *'))
      .slice(0, 24); // длинные списки карточек не растягиваем до бесконечности

    if (!items.length) return;

    const anim = {
      autoAlpha: 0,
      y: 18,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.07,
      // из потока не вынимаем: иначе при появлении прыгает вёрстка
      clearProps: 'transform,opacity,visibility',
    };

    // Секция уже на экране или выше него — ждать прокрутки нечего, иначе она
    // осталась бы прозрачной навсегда: так было при переходе по ссылке из
    // меню и при догрузке секций, которые сразу оказывались в кадре.
    const alreadyInView =
      el.getBoundingClientRect().top < window.innerHeight * START;

    if (immediate || alreadyInView) {
      gsap.from(items, { ...anim, delay: immediate ? 0.1 : 0 });
      return;
    }

    gsap.from(items, {
      ...anim,
      scrollTrigger: {
        trigger: el,
        start: `top ${START * 100}%`,
        once: true,
      },
    });
  }, { scope: root, dependencies: [immediate] });

  return <div ref={root}>{children}</div>;
}
