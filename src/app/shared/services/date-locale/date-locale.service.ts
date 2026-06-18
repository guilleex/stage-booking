import { Injectable, inject } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { I18nService } from '../i18n/i18n.service';

@Injectable({
  providedIn: 'root'
})
export class DateLocaleService {

  private readonly dateAdapter = inject(DateAdapter);
  private readonly i18nService = inject(I18nService);

  constructor() {
    // Initialize with current language from i18n service
    // Use setTimeout to ensure i18n service is fully initialized
    setTimeout(() => {
      this.setLocaleFromLanguage(this.i18nService.language());
    }, 0);
  }

  /**
   * Update Material Design date locale based on language
   * 
   * @param language - The language code ('en' or 'sr')
   */
  setLocaleFromLanguage(language: string): void {
    let locale: string;

    switch (language) {
      case 'en':
        locale = 'en-US';
        break;
      case 'sr':
        locale = 'sr-Latn';
        break;
      default:
        locale = 'en-US';
        break;
    }

    // Update the Material Design date adapter locale
    this.dateAdapter.setLocale(locale);
    
  }

  /**
   * Get Material Design locale string from language code
   * 
   * @param language - The language code
   * @returns Material Design compatible locale string
   */
  getMatLocaleFromLanguage(language: string): string {
    switch (language) {
      case 'en':
        return 'en-US';
      case 'sr':
        return 'sr-Latn';
      default:
        return 'en-US';
    }
  }
}
