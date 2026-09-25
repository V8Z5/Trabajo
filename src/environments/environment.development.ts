/**
 * Development endpoints and public configuration.
 * @remarks Local development uses the same public provider, with distinct editable settings.
 * @author Marlon Packard Viza Quispe
 */
export const environment = {
  production: false,
  tvmazeApiUrl: 'https://api.tvmaze.com',
  searchShowsPath: '/search/shows',
  showDetailsPath: '/shows',
  logoApiUrl: 'https://img.logo.dev',
  logoDomain: 'tvmaze.com',
  logoPublishableToken: '',
  translationsPath: '/i18n/',
  imageFallbackPath: '/poster-placeholder.svg',
  developerCode: 'u202322849',
  developerName: 'Marlon Packard Viza Quispe',
} as const;
