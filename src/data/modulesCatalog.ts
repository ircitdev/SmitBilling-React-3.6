import { BillingModule } from '../types';
import { BILLING_MODULES } from './modulesData';

/**
 * Каталог модулей приходит с сервера лицензий — там его ведут (названия,
 * описания, возможности, версии, разработчик, ссылка на документацию).
 * Оформление витрины — обложка, скриншоты, видео, иконка и категория —
 * остаётся локальным: это часть дизайна сайта, а не каталога.
 *
 * Если сервер недоступен, показываем локальный снимок каталога, чтобы
 * страница не осталась без модулей.
 */

const CATALOG_URL = 'https://license.billing.smit34.ru/api/public/modules/';

interface CatalogModule {
  code: string;
  name: string;
  description: string;
  full_description: string;
  features: string[];
  how_it_works: string[];
  developer: string;
  developer_url: string;
  doc_url: string;
  icon: string;
  category: string;
  category_name: string;
  is_core: boolean;
  current_version: string;
  dependencies: string[];
  versions: Array<{
    version: string;
    released_at: string;
    changelog: string;
    is_current: boolean;
  }>;
}

function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/** Версия из каталога — «2.3.0», на витрине принято «v2.3.0». */
function withV(version: string): string {
  if (!version) return '';
  return /^v/i.test(version) ? version : 'v' + version;
}

function merge(local: BillingModule, remote: CatalogModule): BillingModule {
  const deps = remote.dependencies
    .map((code) => {
      const dep = BILLING_MODULES.find((m) => m.code === code);
      return dep ? { code, name: dep.name } : null;
    })
    .filter((d): d is { code: string; name: string } => d !== null);

  return {
    ...local,
    // с сервера лицензий — содержание
    name: remote.name || local.name,
    version: withV(remote.current_version) || local.version,
    categoryName: remote.category_name || local.categoryName,
    isCore: remote.is_core,
    shortDesc: remote.description || local.shortDesc,
    fullDesc: remote.full_description || local.fullDesc,
    features: remote.features.length ? remote.features : local.features,
    howItWorks: remote.how_it_works.length ? remote.how_it_works : local.howItWorks,
    dependencies: deps.length ? deps : local.dependencies,
    developer: remote.developer || '',
    developerUrl: remote.developer_url || '',
    doc: remote.doc_url || local.doc,
    history: remote.versions.length
      ? remote.versions.map((v) => ({
          version: withV(v.version),
          date: formatDate(v.released_at),
          isCurrent: v.is_current,
          changelog: v.changelog,
        }))
      : local.history,
    // обложка, скриншоты, видео, иконка, категория — остаются локальными
  };
}

/**
 * Возвращает каталог: содержание с сервера лицензий, оформление — своё.
 * Модули, которых нет в локальном списке, пропускаем: для них нет обложки
 * и места в витрине.
 */
export async function loadModules(signal?: AbortSignal): Promise<BillingModule[]> {
  const r = await fetch(CATALOG_URL, { signal });
  if (!r.ok) throw new Error('catalog http ' + r.status);
  const data = await r.json();
  if (!data || !Array.isArray(data.modules)) throw new Error('catalog bad payload');

  const byCode = new Map<string, CatalogModule>();
  for (const m of data.modules as CatalogModule[]) byCode.set(m.code, m);

  return BILLING_MODULES.map((local) => {
    const remote = byCode.get(local.code);
    return remote ? merge(local, remote) : local;
  });
}
