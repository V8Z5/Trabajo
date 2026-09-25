/**
 * Request/response resource contracts for the TVmaze API boundary.
 * @remarks Provider field names are isolated here and never leaked to domain entities.
 * @author Marlon Packard Viza Quispe
 */
export interface TvMazeShowResource {
  id: number;
  name: string;
  language?: string | null;
  genres?: string[];
  status?: string | null;
  rating?: { average?: number | null } | null;
  image?: { medium?: string | null } | null;
  premiered?: string | null;
  runtime?: number | null;
  summary?: string | null;
  officialSite?: string | null;
}

/**
 * A scored search result from TVmaze.
 * @remarks The score is kept for accurate resource modelling; result order is preserved.
 * @author Marlon Packard Viza Quispe
 */
export interface TvMazeSearchResponse {
  score: number;
  show: TvMazeShowResource;
}
