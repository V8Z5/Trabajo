/**
 * A TV series independent of the provider's response format.
 * @remarks Optional provider values are represented as null or an empty collection.
 * @author Marlon Packard Viza Quispe
 */
export interface Series {
  readonly id: number;
  readonly name: string;
  readonly language: string | null;
  readonly genres: readonly string[];
  readonly status: string | null;
  readonly averageRating: number | null;
  readonly imageUrl: string | null;
  readonly premiered: string | null;
  readonly runtime: number | null;
  readonly summary: string | null;
  readonly officialSite: string | null;
}
