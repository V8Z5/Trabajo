/**
 * Browser tests covering TVmaze search, detail requests, translation, resilience, and responsive accessibility.
 * @remarks Network fixtures preserve the public provider's response shape and relevance order.
 * @author Marlon Packard Viza Quispe
 */
import { expect, Page, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const sampleShow = (id: number, term: string) => ({
  score: 0.9 - id / 100,
  show: {
    id, name: `${term} Series ${id}`, language: 'English', genres: ['Drama', 'Science-Fiction'], status: 'Running',
    rating: { average: 8.2 }, image: { medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/1/1.jpg' },
    premiered: '2020-01-02', runtime: 42, summary: '<p>Safe <b>summary</b> text.</p>',
    officialSite: 'https://www.tvmaze.com/',
  },
});

async function arrange(page: Page): Promise<void> {
  await page.route('**/search/shows?q=star', (route) => route.fulfill({ json: Array.from({ length: 14 }, (_, index) => sampleShow(index + 1, 'Star')) }));
  await page.route('**/search/shows?q=love', (route) => route.fulfill({ json: [sampleShow(20, 'Love'), sampleShow(21, 'Love')] }));
  await page.route('**/shows/1', (route) => route.fulfill({ json: sampleShow(1, 'Star').show }));
  await page.route('https://static.tvmaze.com/**', (route) => route.abort());
}

test('defaults to Star and preserves exactly the first twelve relevance results', async ({ page }) => {
  await arrange(page);
  const request = page.waitForRequest('**/search/shows?q=star');
  await page.goto('/');
  expect((await request).method()).toBe('GET');
  await expect(page.getByRole('heading', { name: 'TV Series Explorer' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Series Catalogue' })).toBeVisible();
  const cards = page.locator('app-series-card');
  await expect(cards).toHaveCount(12);
  await expect(cards.first()).toContainText('Star Series 1');
  await expect(cards.last()).toContainText('Star Series 12');
  await expect(page.getByRole('heading', { name: 'Star Series 13' })).toHaveCount(0);
  await expect(cards.first()).toContainText('Science-Fiction');
  await expect(cards.first()).toContainText('8.2 / 10');
  await expect(page.getByRole('contentinfo')).toContainText('Copyright © 2026 TV Series Explorer. All rights reserved.');
  await expect(page.getByRole('contentinfo')).toContainText('u202322849 · Marlon Packard Viza Quispe');
});

test('shows the TVmaze icon in the toolbar without a Logo.dev token', async ({ page }) => {
  await arrange(page);
  await page.route('https://static.tvmaze.com/images/favico/apple-touch-icon-120x120.png', (route) =>
    route.fulfill({ contentType: 'image/png', body: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/BuoAAAAASUVORK5CYII=', 'base64') }));
  await page.goto('/');
  const logo = page.getByRole('img', { name: 'TVmaze logo' });
  await expect(logo).toBeVisible();
  await expect(logo).toHaveAttribute('src', 'https://static.tvmaze.com/images/favico/apple-touch-icon-120x120.png');
});

test('switches to Love, translates all fixed UI text, and keeps selections independent', async ({ page }) => {
  await arrange(page);
  await page.goto('/');
  await expect(page.locator('app-series-card')).toHaveCount(12);
  await page.getByRole('radio', { name: /Love/ }).click();
  await expect(page.locator('app-series-card')).toHaveCount(2);
  await expect(page.locator('app-series-card').first()).toContainText('Love Series 20');
  await page.getByRole('radio', { name: 'Español' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { name: 'Catálogo de Series' })).toBeVisible();
  await expect(page.locator('app-series-card').first()).toContainText('Detalles de la serie');
  await expect(page.getByRole('contentinfo')).toContainText('Desarrollado por');
  await page.getByRole('radio', { name: 'English' }).click();
  await expect(page.getByRole('heading', { name: 'Series Catalogue' })).toBeVisible();
});

test('details button calls the ID endpoint and presents safe additional information', async ({ page }) => {
  await arrange(page);
  const detailRequest = page.waitForRequest('**/shows/1');
  await page.goto('/');
  await expect(page.locator('app-series-card')).toHaveCount(12);
  await page.getByRole('button', { name: 'Series Details for Star Series 1', exact: true }).click();
  expect((await detailRequest).method()).toBe('GET');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('Safe summary text.');
  await expect(dialog).toContainText('2020-01-02');
  await expect(dialog.getByRole('link', { name: /Visit official website/ })).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(dialog.locator('script')).toHaveCount(0);
  await dialog.getByRole('button', { name: 'Close details' }).click();
  await expect(dialog).toHaveCount(0);
});

test('provides an error state and retry action', async ({ page }) => {
  let calls = 0;
  await page.route('**/search/shows?q=star', (route) => ++calls === 1
    ? route.fulfill({ status: 503, json: { error: 'unavailable' } })
    : route.fulfill({ json: [sampleShow(1, 'Star')] }));
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText("We couldn't load the series.");
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.locator('app-series-card')).toHaveCount(1);
  expect(calls).toBe(2);
});

test('handles empty results and absent show fields', async ({ page }) => {
  await page.route('**/search/shows?q=star', (route) => route.fulfill({ json: [] }));
  await page.route('**/search/shows?q=love', (route) => route.fulfill({ json: [{ score: 1, show: { id: 3, name: 'Love Minimal', image: null, rating: null } }] }));
  await page.goto('/');
  await expect(page.getByText('No series found for this search.')).toBeVisible();
  await page.getByRole('radio', { name: /Love/ }).click();
  await expect(page.locator('app-series-card')).toHaveCount(1);
  await expect(page.getByRole('img', { name: 'Poster unavailable for Love Minimal' })).toBeVisible();
  await expect(page.locator('app-series-card')).toContainText('Not available');
});

for (const viewport of [{ width: 360, columns: 1 }, { width: 768, columns: 2 }, { width: 1400, columns: 3 }]) {
  test(`responsive accessibility at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: 900 });
    await arrange(page);
    await page.goto('/');
    await expect(page.locator('app-series-card')).toHaveCount(12);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const columns = await page.locator('.series-grid').evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length);
    expect(columns).toBe(viewport.columns);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to series catalogue' })).toBeFocused();
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) }))).toEqual([]);
  });
}
