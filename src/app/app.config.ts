import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading, withRouterConfig } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
// import { provideNativeDateAdapter } from './shared/services/date-adapter.provider';
import { DateLocaleService } from './shared/services/date-locale/date-locale.service';
import { provideTranslateService } from '@ngx-translate/core';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { I18nService } from './shared/services/i18n/i18n.service';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
      withRouterConfig({ onSameUrlNavigation: 'reload' })
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideAnimationsAsync(),
    provideHttpClient(
      // withInterceptors([
        // loadingInterceptor,
        // apiKeyHttpInterceptor,
        // errorInterceptor
      // ])
    ),
    {
      provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
      useValue: { 
        color: 'accent'
      },
    },
    { 
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, 
      useValue: {
        appearance: 'outline', 
        floatLabel: 'always', 
        subscriptSizing: 'dynamic', 
        hideRequiredMarker: true
      }
    },
    {
      provide: MAT_DATE_LOCALE,
      useFactory: (i18nService: I18nService) => {
        const language = i18nService.language();
        return language === 'sr' ? 'sr-Latn' : 'en-US';
      },
      deps: [I18nService]
    },
    provideNativeDateAdapter(),
    DateLocaleService, // Ensure DateLocaleService is initialized
    DatePipe,
    provideTranslateService({ lang: 'en' }),
    provideToastr()
  ],
};
