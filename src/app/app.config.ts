/**
 * Configures application services and the repository dependency.
 * @remarks Infrastructure is substituted behind a domain repository port.
 * @author Marlon Packard Viza Quispe
 */
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../environments/environment';
import { SeriesRepository } from './series-assets/domain/repositories/series.repository';
import { TvMazeSeriesRepository } from './series-assets/infrastructure/repositories/tvmaze-series.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: environment.translationsPath, suffix: '.json' }),
      fallbackLang: 'en',
      lang: 'en',
    }),
    { provide: SeriesRepository, useClass: TvMazeSeriesRepository },
  ],
};
