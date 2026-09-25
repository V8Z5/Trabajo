/**
 * HttpClient adapter for TVmaze search and show details.
 * @remarks All API base URLs and endpoint paths come from environment configuration.
 * @author Marlon Packard Viza Quispe
 */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, timeout } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Series } from '../../domain/models/series';
import { SearchTerm } from '../../domain/models/search-term';
import { SeriesRepository } from '../../domain/repositories/series.repository';
import { SeriesAssembler } from '../assemblers/series.assembler';

@Injectable()
export class TvMazeSeriesRepository extends SeriesRepository {
  private readonly http = inject(HttpClient);

  /** Searches TVmaze and assembles the first twelve results without reordering them. */
  override search(term: SearchTerm): Observable<readonly Series[]> {
    return this.http.get<unknown>(`${environment.tvmazeApiUrl}${environment.searchShowsPath}`, {
      params: { q: term },
    }).pipe(timeout(20000), map((response) => SeriesAssembler.fromSearchResponse(response)));
  }

  /** Retrieves fresh details for an individual show. */
  override findById(id: number): Observable<Series> {
    return this.http.get<unknown>(`${environment.tvmazeApiUrl}${environment.showDetailsPath}/${id}`)
      .pipe(timeout(20000), map((response) => SeriesAssembler.fromDetailsResponse(response)));
  }
}
