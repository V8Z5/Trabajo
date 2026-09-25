/**
 * Signal-backed state for the selected search and its results.
 * @remarks switchMap cancels stale requests when the user changes categories quickly.
 * @author Marlon Packard Viza Quispe
 */
import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, concat, map, of, startWith, Subject, switchMap } from 'rxjs';
import { Series } from '../domain/models/series';
import { SearchTerm } from '../domain/models/search-term';
import { SeriesRepository } from '../domain/repositories/series.repository';

/**
 * Discriminated catalogue state.
 * @remarks Rendering uses its status to avoid showing stale records after a failure.
 * @author Marlon Packard Viza Quispe
 */
export type CatalogueState =
  | { status: 'loading'; series: readonly Series[] }
  | { status: 'success'; series: readonly Series[] }
  | { status: 'error'; series: readonly Series[] };

@Injectable({ providedIn: 'root' })
export class SeriesCatalogueState {
  private readonly repository = inject(SeriesRepository);
  private readonly requests = new Subject<SearchTerm>();
  private readonly activeTerm = signal<SearchTerm>('star');
  readonly term = this.activeTerm.asReadonly();
  readonly state = toSignal(this.requests.pipe(
    startWith<SearchTerm>('star'),
    switchMap((term) => concat(
      of<CatalogueState>({ status: 'loading', series: [] }),
      this.repository.search(term).pipe(
        map((series): CatalogueState => ({ status: 'success', series })),
        catchError(() => of<CatalogueState>({ status: 'error', series: [] })),
      ),
    )),
  ), { initialValue: { status: 'loading', series: [] } as CatalogueState });

  /** Selects a term and initiates its search. */
  selectTerm(term: SearchTerm): void {
    if (term === this.activeTerm()) return;
    this.activeTerm.set(term);
    this.requests.next(term);
  }

  /** Retries the current search after an API failure. */
  retry(): void {
    this.requests.next(this.activeTerm());
  }
}
