/**
 * Production endpoints and public configuration.
 * @remarks Replace the publishable Logo.dev token with a valid pk_ value when available.
 * @author Marlon Packard Viza Quispe
 */
export const environment = {
  production: true,
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
