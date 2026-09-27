import React, { useRef } from 'react';

/**
 * Живая обложка карточки: в покое — кадр, при наведении играет короткий ролик.
 *
 * Сделано одним элементом на модули и виджеты: карточки разные, а поведение
 * обложки одинаковое. Ролик подгружается только по наведению (preload="none"),
 * иначе десяток карточек тянул бы по полтора мегабайта каждая ещё до того, как
 * посетитель до них долистает.
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
}

export default function LiveCover({ video, image, alt, className = '' }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

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
      preload="none"
      aria-label={alt}
      className={className}
      onMouseEnter={play}
      onMouseLeave={stop}
      onFocus={play}
      onBlur={stop}
      // на телефоне наведения нет: ролик стартует, когда карточка видна
      onLoadedData={() => {
        if (window.matchMedia('(hover: none)').matches) play();
      }}
    />
  );
}
