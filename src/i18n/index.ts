import { Locale, TranslationParams, LocaleChangeListener } from './types';
import { TRANSLATIONS } from './translations';

export class I18nManager {
  public static readonly STORAGE_KEY = 'berkeley_dalgalar_lang';
  private locale: Locale = 'tr';
  private listeners: Set<LocaleChangeListener> = new Set();

  constructor() {
    this.locale = this.resolveInitialLocale();
  }

  private resolveInitialLocale(): Locale {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(I18nManager.STORAGE_KEY);
        if (stored === 'en' || stored === 'tr') {
          return stored;
        }
      }
    } catch {
      // LocalStorage access may fail in restricted/private browsing modes
    }
    return 'tr';
  }

  public getLocale(): Locale {
    return this.locale;
  }

  public setLocale(newLocale: Locale): void {
    const validLocale: Locale = (newLocale === 'en' || newLocale === 'tr') ? newLocale : 'tr';
    const isSameLocale = (this.locale === validLocale);

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(I18nManager.STORAGE_KEY);
        if (stored !== validLocale) {
          window.localStorage.setItem(I18nManager.STORAGE_KEY, validLocale);
        }
      }
    } catch {
      // Suppress localStorage quota/security errors
    }

    if (isSameLocale) {
      return;
    }

    this.locale = validLocale;

    if (typeof document !== 'undefined') {
      document.documentElement.lang = validLocale;
      document.title = this.t('shell.pageTitle');
      const descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) {
        descMeta.setAttribute('content', this.t('shell.metaDescription'));
      }
    }

    for (const listener of this.listeners) {
      try {
        listener(validLocale);
      } catch (err) {
        console.error('Error in i18n subscriber listener:', err);
      }
    }
  }

  public t(key: string, params?: TranslationParams): string {
    const dict = TRANSLATIONS[this.locale] || TRANSLATIONS['tr'];
    let text = this.resolveKey(dict as unknown as Record<string, unknown>, key);

    if (!text && this.locale !== 'tr') {
      text = this.resolveKey(TRANSLATIONS['tr'] as unknown as Record<string, unknown>, key);
    }

    if (!text) {
      return key;
    }

    if (params) {
      for (const [pKey, pVal] of Object.entries(params)) {
        text = text.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
      }
    }

    return text;
  }

  public subscribe(listener: LocaleChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private resolveKey(obj: Record<string, unknown>, path: string): string | undefined {
    const parts = path.split('.');
    let cur: unknown = obj;
    for (const part of parts) {
      if (cur == null || typeof cur !== 'object') return undefined;
      cur = (cur as Record<string, unknown>)[part];
    }
    return typeof cur === 'string' ? cur : undefined;
  }
}

export const i18nManager = new I18nManager();
export * from './types';
export * from './translations';
