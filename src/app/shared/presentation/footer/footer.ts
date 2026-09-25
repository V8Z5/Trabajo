/**
 * Copyright and developer attribution.
 * @remarks The specified static text is translated for the selected UI language.
 * @author Marlon Packard Viza Quispe
 */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-footer',
  imports: [TranslatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  readonly developer = { code: environment.developerCode, name: environment.developerName };
}
