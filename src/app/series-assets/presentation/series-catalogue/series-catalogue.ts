/**
 * Main catalogue view for Star and Love searches.
 * @remarks Opens a separate Material details dialog while keeping catalogue state intact.
 * @author Marlon Packard Viza Quispe
 */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { SeriesCatalogueState } from '../../application/series-catalogue-state';
import { SearchTerm } from '../../domain/models/search-term';
import { SeriesCard } from '../series-card/series-card';
import { SeriesDetails } from '../series-details/series-details';

@Component({
  selector: 'app-series-catalogue',
  imports: [MatButtonModule, MatButtonToggleModule, MatProgressSpinnerModule, TranslatePipe, SeriesCard],
  templateUrl: './series-catalogue.html',
  styleUrl: './series-catalogue.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeriesCatalogue {
  readonly catalogue = inject(SeriesCatalogueState);
  private readonly dialog = inject(MatDialog);

  /** Changes the selected search term. */
  selectTerm(term: SearchTerm): void {
    this.catalogue.selectTerm(term);
  }

  /** Opens a detail request for the selected show. */
  openDetails(id: number): void {
    this.dialog.open(SeriesDetails, { data: id, width: '720px', maxWidth: 'calc(100vw - 24px)', autoFocus: 'first-tabbable', ariaLabelledBy: 'series-details-heading' });
  }
}
