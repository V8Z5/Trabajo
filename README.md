# TV Series Explorer

**Project name:** `pc17737u202322849`  
**Course:** Open Source Application Development, NRC 7737  
**Author:** Marlon Packard Viza Quispe (`u202322849`)

## Description

TV Series Explorer is a responsive Angular 22 and Angular Material application for browsing TVmaze shows. The initial **Star** catalogue fetches `https://api.tvmaze.com/search/shows?q=star`; selecting **Love** fetches `https://api.tvmaze.com/search/shows?q=love`. The first **12** results in each response are displayed in their original relevance order. Selecting **Series Details** fetches `https://api.tvmaze.com/shows/{id}` and displays further information in a Material dialog.

## Requirements

- Node.js **24.15 or later**, **22.22.3 or later**, or a compatible version supported by Angular 22.
- npm 11 or a compatible npm version.
- An internet connection to load TVmaze data and posters.
- Optional: a **Logo.dev publishable token** (`pk_…`) to show the official TVmaze logo from Logo.dev. Without a token, the toolbar presents a clearly marked TV fallback. The image URL is assembled from the configured `tvmaze.com` domain.

## Getting started in JetBrains WebStorm

Open the project folder in WebStorm and run:

```bash
npm ci
npm start
```

Visit [http://localhost:4200](http://localhost:4200). WebStorm can also run the `start` npm script directly. Client-side routing and a sidebar are intentionally omitted.

## Configuration

The files `src/environments/environment.development.ts` and `src/environments/environment.ts` hold the API URL, route paths, translation path, logo endpoint and domain, public logo token, poster fallback path, and developer attribution for development and production respectively. The Angular development configuration replaces the production environment file during `npm start`.

To activate the real TVmaze logo from **Logo.dev**, obtain a free **publishable** token at [Logo.dev](https://www.logo.dev/) and set `logoPublishableToken` in both environment files. It is a public browser key, never a private API secret. Logo.dev requires it for requests to `https://img.logo.dev/tvmaze.com`.

## Features

- A Material toolbar with a TVmaze identity, title, and EN / ES language controls.
- A three-column desktop catalogue, two columns on tablet, and one column on mobile.
- Poster, name, language, genre, status, rating, and a details action on each Material card.
- English by default; all application-authored interface strings, labels, accessibility announcements, and the two-line footer switch to Spanish with `@ngx-translate/core` and `@ngx-translate/http-loader`. TVmaze show names and descriptions retain the provider's original language.
- Angular Signals manage language, selected term, loading, results, error, and image fallback state. RxJS cancels stale searches.
- Accessible landmarks, keyboard skip link, semantic descriptions, image alternatives, ARIA labels, and safe external links.
- Empty, loading, error, and retry states. Invalid resource data cannot create unsafe hyperlinks.

## Structure and patterns

| Directory | Purpose |
| --- | --- |
| `src/app/shared/domain` | Language type |
| `src/app/shared/application` | Signal-backed language state |
| `src/app/shared/presentation` | Toolbar and footer |
| `src/app/series-assets/domain` | Entity, search term, and repository port |
| `src/app/series-assets/application` | Catalogue state and search behavior |
| `src/app/series-assets/infrastructure` | TVmaze request/response resources, assembler, and HttpClient adapter |
| `src/app/series-assets/presentation` | Catalogue, cards, and details dialog |

This structure combines layered and component-based architecture. Dependency injection supplies the repository implementation; the assembler translates TVmaze resources into independent domain entities. Source classes and interfaces include TSDoc summaries, remarks, and author information.

## Build and checks

```bash
npm run build
npx playwright install chromium --only-shell
npm test
```

Browser tests use isolated API fixtures to verify the first-twelve limit, result order, Star/Love switching, English/Spanish text, details endpoint, retry, missing data, keyboard use, layout widths, and axe accessibility checks. A production build is emitted to `dist/pc17737u202322849/browser`.

## Packaging

The submission ZIP is named **`pc17737u202322849.zip`**. Extract it, open the contained project folder in WebStorm, and run `npm ci` followed by `npm start`. The ZIP omits generated dependencies, caches, and build output.

## References

- [TVmaze API](https://www.tvmaze.com/api)
- [Angular 22 compatibility](https://angular.dev/reference/versions)
- [ngx-translate installation](https://ngx-translate.org/getting-started/installation/)
- [Logo.dev Logo API](https://www.logo.dev/docs/logo-images/introduction)
