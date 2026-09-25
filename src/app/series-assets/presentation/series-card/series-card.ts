/**
 * Reusable Material card for one TV series.
 * @remarks Displays safe poster imagery, accessible metadata, and a details action.
 * @author Marlon Packard Viza Quispe
 */
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { Series } from '../../domain/models/series';

@Component({
  selector: 'app-series-card',
  imports: [MatButtonModule, MatCardModule, TranslatePipe],
  templateUrl: './series-card.html',
  styleUrl: './series-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeriesCard {
  readonly series = input.required<Series>();
  readonly detailsRequested = output<number>();
  readonly imageFailed = signal(false);
  readonly fallback = environment.imageFallbackPath;

  /** Sends the selected series ID to its catalogue. */
  openDetails(): void {
    this.detailsRequested.emit(this.series().id);
  }
}
