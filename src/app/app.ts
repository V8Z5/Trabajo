/**
 * Application shell for the TV Series Explorer.
 * @remarks Owns the header, main catalogue, and attribution footer.
 * @author Marlon Packard Viza Quispe
 */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Toolbar } from './shared/presentation/toolbar/toolbar';
import { Footer } from './shared/presentation/footer/footer';
import { SeriesCatalogue } from './series-assets/presentation/series-catalogue/series-catalogue';

@Component({
  selector: 'app-root',
  imports: [TranslatePipe, Toolbar, Footer, SeriesCatalogue],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
