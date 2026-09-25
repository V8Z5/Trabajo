/**
 * Reactive language state shared by interface components.
 * @remarks Delegates dictionary loading to ngx-translate and synchronizes document language.
 * @author Marlon Packard Viza Quispe
 */
import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../domain/models/language';

@Injectable({ providedIn: 'root' })
export class LanguageState {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly currentLanguage = signal<Language>('en');
  readonly language = this.currentLanguage.asReadonly();

  /** Changes the UI language and its assistive-technology metadata. */
  setLanguage(language: Language): void {
    this.currentLanguage.set(language);
    this.document.documentElement.lang = language;
    this.translate.use(language);
  }
}
