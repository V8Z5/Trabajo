/**
 * Material toolbar with the TVmaze identity and language selector.
 * @remarks Uses Logo.dev when configured and TVmaze's published icon otherwise.
 * @author Marlon Packard Viza Quispe
 */
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { LanguageState } from '../../application/language-state';
import { Language } from '../../domain/models/language';

@Component({
  selector: 'app-toolbar',
  imports: [MatToolbarModule, MatButtonToggleModule, TranslatePipe],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toolbar {
  readonly languageState = inject(LanguageState);
  readonly logoFailed = signal(false);
  readonly logoUrl = computed(() => environment.logoPublishableToken
    ? `${environment.logoApiUrl}/${environment.logoDomain}?token=${encodeURIComponent(environment.logoPublishableToken)}&format=png&size=96`
    : environment.tvmazeLogoUrl);

  /** Applies a selected supported language. */
  selectLanguage(language: Language): void {
    this.languageState.setLanguage(language);
  }
}
