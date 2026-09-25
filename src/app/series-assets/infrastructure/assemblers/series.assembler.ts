/**
 * Assembles provider resources into safe domain entities.
 * @remarks Sanitizes image and external links while preserving original result order.
 * @author Marlon Packard Viza Quispe
 */
import { Series } from '../../domain/models/series';
import { TvMazeShowResource, TvMazeSearchResponse } from '../resources/tvmaze-search-response';

export class SeriesAssembler {
  /** Converts only the first twelve response items into domain entities. */
  static fromSearchResponse(response: unknown): readonly Series[] {
    if (!Array.isArray(response)) throw new Error('Invalid TVmaze search response');
    return response.slice(0, 12)
      .filter((item): item is TvMazeSearchResponse =>
        typeof item === 'object' && item !== null && 'show' in item && this.isShow(item.show))
      .map((item) => this.fromShowResource(item.show));
  }

  /** Converts one show detail response into a domain entity. */
  static fromDetailsResponse(response: unknown): Series {
    if (!this.isShow(response)) throw new Error('Invalid TVmaze show response');
    return this.fromShowResource(response);
  }

  private static isShow(value: unknown): value is TvMazeShowResource {
    return typeof value === 'object' && value !== null && 'id' in value && 'name' in value
      && Number.isInteger(value.id) && Number(value.id) > 0
      && typeof value.name === 'string' && value.name.trim().length > 0;
  }

  private static safeUrl(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    try {
      const url = new URL(value);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
    } catch { return null; }
  }

  private static fromShowResource(resource: TvMazeShowResource): Series {
    return {
      id: resource.id,
      name: resource.name.trim(),
      language: typeof resource.language === 'string' ? resource.language : null,
      genres: Array.isArray(resource.genres) ? resource.genres.filter((genre): genre is string => typeof genre === 'string') : [],
      status: typeof resource.status === 'string' ? resource.status : null,
      averageRating: typeof resource.rating?.average === 'number' && Number.isFinite(resource.rating.average) ? resource.rating.average : null,
      imageUrl: this.safeUrl(resource.image?.medium),
      premiered: typeof resource.premiered === 'string' ? resource.premiered : null,
      runtime: typeof resource.runtime === 'number' ? resource.runtime : null,
      summary: typeof resource.summary === 'string' ? resource.summary.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : null,
      officialSite: this.safeUrl(resource.officialSite),
    };
  }
}
