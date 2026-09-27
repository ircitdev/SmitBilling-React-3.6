import { WidgetItem } from '../types';
import { WIDGETS_DATA } from './landingData';

/**
 * Каталог виджетов приходит с сервера лицензий — там его ведут (названия,
 * описания, возможности, версии, куда виджет встаёт). Оформление витрины —
 * обложка и ролик — остаётся локальным: это часть дизайна сайта.
 *
 * Сделано так же, как у модулей: раньше виджеты были прописаны в самом сайте
 * и расходились с каталогом — версия в карточке жила своей жизнью.
 *
 * Если сервер недоступен, показываем локальный снимок, чтобы раздел не
 * остался пустым.
 */

const CATALOG_URL = 'https://license.billing.smit34.ru/api/public/widgets/';

/** Где лежат обложки витрины: имя файла — код виджета. */
const COVERS = 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/site/widgets';

interface CatalogWidget {
  slug: string;
  name: string;
  description: string;
  full_description: string;
  features: string[];
  how_it_works: string[];
  developer: string;
  developer_url: string;
  module: string;
  category: string;
  category_name: string;
  icon: string;
  version: string;
  target: string;
  target_name: string;
}

/** Версия из каталога — «1.1.0», на витрине принято «v1.1.0». */
function withV(version: string): string {
  if (!version) return '';
  return /^v/i.test(version) ? version : 'v' + version;
}

/** Категория витрины: у каталога свой набор, у карточек — свой. */
function toCat(code: string): WidgetItem['cat'] {
  const map: Record<string, WidgetItem['cat']> = {
    crm: 'crm',
    support: 'support',
    analytics: 'analytics',
    abonents: 'abonents',
    ai: 'ai',
  };
  return map[code] || 'other';
}

function merge(local: WidgetItem | undefined, remote: CatalogWidget): WidgetItem {
  const base: WidgetItem = local || {
    id: remote.slug,
    name: remote.name,
    cat: toCat(remote.category),
    catName: remote.category_name || '',
    version: '',
    icon: remote.icon || 'Puzzle',
    desc: '',
    features: [],
    how: [],
    shots: [],
  };

  return {
    ...base,
    // с сервера лицензий — содержание
    name: remote.name || base.name,
    version: withV(remote.version) || base.version,
    catName: remote.category_name || base.catName,
    desc: remote.description || base.desc,
    shortDesc: remote.description || base.shortDesc,
    fullDesc: remote.full_description || base.fullDesc,
    features: remote.features.length ? remote.features : base.features,
    how: remote.how_it_works.length ? remote.how_it_works : base.how,
    developer: remote.developer || base.developer,
    developerUrl: remote.developer_url || base.developerUrl,
    targetName: remote.target_name || base.targetName,
    // оформление — своё: обложка и ролик по коду виджета
    cover: base.cover || `${COVERS}/widget-${remote.slug}.png`,
    coverVideo: base.coverVideo || `${COVERS}/widget-${remote.slug}.mp4`,
  };
}

/**
 * Каталог виджетов: содержание с сервера, оформление своё.
 * Виджеты, которых нет в локальном списке, тоже показываем — обложка у них
 * собирается по коду, а содержание целиком приходит с сервера.
 */
export async function loadWidgets(signal?: AbortSignal): Promise<WidgetItem[]> {
  const r = await fetch(CATALOG_URL, { signal });
  if (!r.ok) throw new Error('widgets http ' + r.status);
  const data = await r.json();
  if (!data || !Array.isArray(data.widgets)) throw new Error('widgets bad payload');

  const byId = new Map<string, WidgetItem>();
  for (const w of WIDGETS_DATA) byId.set(w.id, w);

  return (data.widgets as CatalogWidget[]).map((remote) =>
    merge(byId.get(remote.slug), remote),
  );
}
