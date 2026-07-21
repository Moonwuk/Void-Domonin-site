import { CONTENT, type Locale } from './data';

const STORAGE_KEY = 'vd-locale';
export const LOCALES: Locale[] = ['ru', 'en', 'zh'];
export const LOCALE_LABEL: Record<Locale, string> = { ru: 'RU', en: 'EN', zh: '中文' };

function matchLanguage(tag: string): Locale | null {
  const t = tag.toLowerCase();
  if (t.startsWith('ru')) return 'ru';
  if (t.startsWith('zh')) return 'zh';
  if (t.startsWith('en')) return 'en';
  return null;
}

/** Ручной выбор из localStorage, иначе язык браузера, иначе английский. */
export function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (LOCALES as string[]).includes(saved)) return saved as Locale;
  } catch {
    /* приватный режим — просто определяем по браузеру */
  }
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of candidates) {
    const match = tag && matchLanguage(tag);
    if (match) return match;
  }
  return 'en';
}

export function persistLocale(locale: Locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* недоступно — выбор проживёт до перезагрузки */
  }
}

/** Синхронизирует документ с выбранным языком (lang, title, description). */
export function applyLocaleToDocument(locale: Locale) {
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale;
  document.title = CONTENT[locale].meta.title;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', CONTENT[locale].meta.description);
}
