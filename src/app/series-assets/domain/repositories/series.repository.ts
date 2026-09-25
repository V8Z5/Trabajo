/**
 * Repository port for searching and loading a series.
 * @remarks Application services depend on this abstraction rather than HttpClient.
 * @author Marlon Packard Viza Quispe
 */
import { Observable } from 'rxjs';
import { Series } from '../models/series';
import { SearchTerm } from '../models/search-term';

export abstract class SeriesRepository {
  /** Returns up to the first twelve items in provider relevance order. */
  abstract search(term: SearchTerm): Observable<readonly Series[]>;

  /** Retrieves additional information for a selected series. */
  abstract findById(id: number): Observable<Series>;
}
