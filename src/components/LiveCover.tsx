import React, { useEffect, useRef } from 'react';

/**
 * Живая обложка карточки: в покое — кадр, при наведении играет короткий ролик.
 *
 * Сделано одним элементом на модули и виджеты: карточки разные, а поведение
 * обложки одинаковое. Ролик подгружается только по наведению (preload="none"),
 * иначе десяток карточек тянул бы по полтора мегабайта каждая ещё до того, как
 * посетитель до них долистает.
 *
 * На телефоне наведения нет, поэтому там играет та карточка, которая сейчас на
 * экране: следим за видимостью и запускаем ролик, когда карточка попала в кадр.
 * Раньше запуск висел на onLoadedData, но при preload="none" это событие не
 * наступает вовсе — файл не грузится, пока его не запросят, и обложки на
 * телефоне стояли неподвижно.
 *
 * Если ролика нет — ведёт себя как обычная картинка.
 */
interface Props {
  /** Ролик обложки (mp4). Без него показывается только кадр. */
  video?: string;
  /** Кадр: постер для ролика и запасной вариант. */
  image?: string;
  alt: string;
  className?: string;
  /** Играть постоянно, не дожидаясь наведения — для окна модуля. */
  autoPlay?: boolean;
}

export default function LiveCover({ video, image, alt, className = '',
                                    autoPlay = false }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  // Телефон и планшет: наведения нет — играет карточка, попавшая на экран.
  useEffect(() => {
    if (!video || autoPlay) return;
    const v = ref.current;
    if (!v) return;

    let touch = false;
    try {
      touch = window.matchMedia('(hover: none)').matches;
    } catch {
      // старый браузер без matchMedia — оставляем поведение как на десктопе
    }
    if (!touch || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            // preload="none" не грузит файл сам — просим явно
            if (v.preload === 'none') v.preload = 'auto';
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      // половина карточки в кадре: иначе ролики запускались бы у всех соседей
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [video, autoPlay]);

  if (!video) {
    return (
      <img src={image} alt={alt} className={className} loading="lazy" />
    );
  }

  const play = () => {
    const v = ref.current;
    if (!v) return;
    // play() возвращает промис и отклоняется, если пользователь увёл курсор
    // раньше, чем ролик начался, — это не ошибка, гасим
    v.play().catch(() => {});
  };

  const stop = () => {
    const v = ref.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <video
      ref={ref}
      src={video}
      poster={image}
      muted
      loop
      playsInline
      preload={autoPlay ? 'auto' : 'none'}
      autoPlay={autoPlay}
      aria-label={alt}
      className={className}
      onMouseEnter={autoPlay ? undefined : play}
      onMouseLeave={autoPlay ? undefined : stop}
      onFocus={autoPlay ? undefined : play}
      onBlur={autoPlay ? undefined : stop}
    />
  );
}
