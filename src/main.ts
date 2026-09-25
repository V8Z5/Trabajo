/**
 * Starts the standalone application.
 * @remarks Routing is intentionally outside the requested scope.
 * @author Marlon Packard Viza Quispe
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig).catch((error: unknown) => console.error(error));
