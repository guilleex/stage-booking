import { computed, inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import englishTranslations from '../../i18n/en.json';
import serbianTranslations from '../../i18n/sr.json';
import { enUS } from 'date-fns/locale';
import { srLatn } from 'date-fns/locale';
import { PreferencesService } from '../preferences/preferences.service';

const LANGUAGE = '_language';

@Injectable({
  providedIn: 'root'
})
/**
 * Language translation service
 * 
 * Manages i18n for the application using ngx-translate.
 * Handles language selection, persistence, and translation lookups.
 */
export class I18nService {

  private readonly translateSrv = inject(TranslateService);
  private readonly preferenceSrv = inject(PreferencesService);

  #language = signal<string>('en');
  language = this.#language.asReadonly();

  chartsLocale = computed(() => {
    return this.language() === 'en' ? enUS : srLatn;
  });

  monthlyFormat = signal<string>('MM/YYYY').asReadonly();

  format = computed(() => {
    return this.language() === 'sr' ? 'dd/MM HH:mm:ss' : 'MM/dd HH:mm:ss';
  });

  constructor() {
    this.initializeTranslations();
    this.loadSavedLanguage();
  }

  private initializeTranslations(): void {
    this.translateSrv.setTranslation('en', englishTranslations);
    this.translateSrv.setTranslation('sr', serbianTranslations);
  }

  private async loadSavedLanguage(): Promise<void> {
    const lng = await this.getLanguage();
    this.translateSrv.use(lng);
  }

  /**
   * Set language and persist to local storage
   */
  setLanguage(lng: string): void {
    this.#language.set(lng);
    this.translateSrv.use(lng);
    this.preferenceSrv.setPreference(LANGUAGE, lng);
  }

  /**
   * Load language from local storage
   */
  async getLanguage(): Promise<string> {
    const savedLng = await this.preferenceSrv.getPreference(LANGUAGE);
    const language = savedLng ?? 'sr';
    this.#language.set(language);
    return language;
  }

  /**
   * Get translation for a term with optional interpolation
   */
  translate(term: string, properties?: Record<string, string>): string {
    return this.translateSrv.instant(term, properties);
  }

  /**
   * Get date format string based on current language
   */
  dateFormat(includeTime = false, short = false): string {
    const isSerbian = this.language() === 'sr';
    const datePart = short ? (isSerbian ? 'dd/MM' : 'MM/dd') : (isSerbian ? 'dd/MM/yyyy' : 'MM/dd/yyyy');
    const timePart = ' HH:mm';
    return includeTime ? datePart + timePart : datePart;
  }

  /**
   * Get date format for table date columns with time
   */
  tableDateTimeFormat(): string {
    return this.dateFormat(true, false);
  }

  /**
   * Get date format for table date columns without time
   */
  tableDateFormat(): string {
    return this.dateFormat(false, false);
  }
}
