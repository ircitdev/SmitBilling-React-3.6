/**
 * Картинки секций главной страницы — все ссылки собраны здесь.
 *
 * Сейчас это концепт-визуалы: интерфейсы на них нарисованы, а не сняты
 * с рабочей системы. Когда появятся снимки настоящих экранов, менять код
 * секций не нужно — достаточно положить файлы с теми же именами в
 * gs://uspeshnyy-projects/smit/billing/landing2/ и, если поменяются
 * пропорции, поправить width/height ниже.
 *
 * Размеры нужны, чтобы страница не прыгала, пока грузятся картинки.
 */

const BASE = 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/landing2/';

export interface LandingImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** true — визуал нарисованный, не снимок продукта. */
  concept?: boolean;
}

const img = (
  name: string,
  width: number,
  height: number,
  alt: string,
  concept = true,
): LandingImage => ({ src: `${BASE}${name}.jpg`, width, height, alt, concept });

export const LANDING_IMAGES = {
  hero: img(
    'hero-dashboard',
    1544,
    1340,
    'Сводка оператора: абоненты, платежи и события дня на одном экране',
  ),
  clientStory: img(
    'client-story',
    1500,
    770,
    'Карточка клиента: договор, услуги, баланс и история обращений',
  ),
  networkMap: img(
    'network-map',
    1594,
    910,
    'Карта сети: узлы, охват и авария на конкретном узле',
  ),
  support: img(
    'support',
    1584,
    690,
    'Обращение клиента в мессенджере рядом с его карточкой',
  ),
  ai: img(
    'ai-assistant',
    1524,
    590,
    'AI-помощник сообщает о всплеске переподключений на узле',
  ),
  migration: img('migration', 1544, 644, 'Четыре шага переноса: анализ, перенос, проверка, запуск'),
  security: img('security', 1544, 610, 'СОРМ, резервные копии, права доступа и журнал действий'),
  caseStudy: img('case-study', 1514, 550, 'Оператор на 12 000 абонентов после перехода'),
  robotGirl: img('robot-girl', 780, 910, ''),
  robotBoy: img('robot-boy', 804, 910, ''),
} satisfies Record<string, LandingImage>;
