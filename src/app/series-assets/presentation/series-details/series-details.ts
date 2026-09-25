/**
 * Accessible Material dialog with additional TVmaze show information.
 * @remarks Fetches the selected ID from the show's detail endpoint on open.
 * @author Marlon Packard Viza Quispe
 */
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, map, of } from 'rxjs';
import { SeriesRepository } from '../../domain/repositories/series.repository';
import { Series } from '../../domain/models/series';
import { environment } from '../../../../environments/environment';

type DetailState = { status: 'loading' | 'success' | 'error'; series: Series | null };

@Component({
  selector: 'app-series-details',
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule, TranslatePipe],
  templateUrl: './series-details.html',
  styleUrl: './series-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeriesDetails {
  private readonly repository = inject(SeriesRepository);
  private readonly id = inject<number>(MAT_DIALOG_DATA);
  readonly imageFailed = signal(false);
  readonly posterFallback = environment.imageFallbackPath;
  readonly detail = toSignal(this.repository.findById(this.id).pipe(
    map((series): DetailState => ({ status: 'success', series })),
    catchError(() => of<DetailState>({ status: 'error', series: null })),
  ), { initialValue: { status: 'loading', series: null } as DetailState });
}
