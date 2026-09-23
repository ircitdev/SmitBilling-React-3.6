/**
 * Картинки главной страницы — все ссылки собраны здесь.
 *
 * Сейчас это визуалы из концепт-макета: интерфейсы на них нарисованы,
 * а не сняты с рабочей системы. Когда появятся снимки настоящих экранов,
 * менять код секций не нужно — положите файлы с теми же именами в
 * gs://uspeshnyy-projects/smit/billing/landing2/ и поправьте размеры ниже,
 * если изменятся пропорции.
 *
 * Размеры нужны, чтобы страница не прыгала, пока картинки грузятся.
 */

const BASE = 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/landing2/';

export interface LandingImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

const img = (file: string, width: number, height: number, alt: string): LandingImage => ({
  src: BASE + file,
  width,
  height,
  alt,
});

/** Экраны и фоны секций. */
export const LANDING_IMAGES = {
  /** Дашборд оператора — главный визуал первого экрана. */
  dashboard: img(
    'dashboard-flat.webp',
    1100,
    800,
    'Сводка оператора: абоненты, платежи и события дня на одном экране',
  ),
  clientStory: img(
    'client-story.jpg',
    1500,
    770,
    'Карточка клиента: договор, услуги, баланс и история обращений',
  ),
  networkMap: img('network-map.jpg', 1594, 910, 'Карта сети: узлы, охват и авария на узле'),
  support: img('support.jpg', 1584, 690, 'Обращение клиента в мессенджере рядом с его карточкой'),
  ai: img('ai-assistant.jpg', 1524, 590, 'Помощник сообщает о всплеске переподключений на узле'),
  migration: img('migration.jpg', 1544, 644, 'Четыре шага переноса: анализ, перенос, проверка, запуск'),
  security: img('security.jpg', 1544, 610, 'СОРМ, резервные копии, права доступа и журнал действий'),
  caseStudy: img('case-study.jpg', 1514, 550, 'Оператор на 12 000 абонентов после перехода'),
} satisfies Record<string, LandingImage>;

/**
 * Фоновые подложки секций. Ставятся под содержимое с затемнением —
 * поэтому без alt: смысла не несут, только настроение.
 */
export const LANDING_BACKDROPS = {
  network: BASE + 'bg-network.webp',
  server: BASE + 'bg-server.webp',
  city: BASE + 'bg-city.webp',
} as const;

/**
 * Роботы-маскоты. Вырезаны по контуру, прозрачный фон — ставятся на
 * любую подложку. Держим их в стороне от текста: на первом экране
 * фигура не должна перекрывать заголовок и кнопки.
 */
export const LANDING_ROBOTS = {
  /** Девушка в полный рост, указывает — первый экран и финальный призыв. */
  girlPoint: img('robot-girl-point.webp', 780, 1100, ''),
  /** Девушка по пояс — рядом с блоком про помощника. */
  girlBust: img('robot-girl-bust.webp', 1080, 1100, ''),
  /** Парень с планшетом, жест «хорошо» — поддержка и финальный призыв. */
  boyThumb: img('robot-boy-thumb.webp', 993, 1100, ''),
  /** Парень по пояс — запасной вариант для светлого фона. */
  boyBust: img('robot-boy-bust.webp', 888, 1100, ''),
} satisfies Record<string, LandingImage>;

/**
 * Рукописные подписи-выноски из макета. Это картинки, а не текст,
 * поэтому смысл дублируется в alt — иначе фраза пропадёт для тех,
 * кто читает страницу с экранного диктора.
 *
 * `light` — надпись светлая, читается только на тёмном фоне.
 */
export const LANDING_NOTES = {
  client: { ...img('note-client.webp', 1030, 1080, 'Клиент уже здесь — подскажу решение'), light: false },
  growth: { ...img('note-growth.webp', 1080, 1100, 'Технологии для роста людей'), light: true },
  support: { ...img('note-support.webp', 1026, 1100, 'Надёжная поддержка на каждом этапе'), light: true },
  platform: { ...img('note-platform.webp', 1100, 738, 'Стабильная платформа для больших задач'), light: true },
} as const;
