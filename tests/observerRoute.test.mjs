import test from 'node:test';
import assert from 'node:assert/strict';
import { getObserverRouteAction, isObserverRoute } from '../.test-dist/utils/observerRoute.js';
import { DEFAULT_SETTINGS, BadgePosition } from '../.test-dist/types/settings.js';

function settings(overrides = {}) {
  return {
    ...DEFAULT_SETTINGS,
    ...overrides,
  };
}

test('observer runs on library routes including collection tabs', () => {
  assert.equal(isObserverRoute('/routes/library'), true);
  assert.equal(isObserverRoute('/routes/library/home'), true);
  assert.equal(isObserverRoute('/routes/library/tab/DesktopApps'), true);
  assert.equal(isObserverRoute('/routes/library/tab/7c36d9ac-dfa4-44b3-8a1e-8da01dfb1e46'), true);
});

test('observer does not run on apprunning route', () => {
  assert.equal(isObserverRoute('/routes/apprunning'), false);
  assert.equal(
    getObserverRouteAction({
      pathname: '/routes/apprunning',
      observerActive: true,
      settings: settings(),
    }),
    'stop',
  );
});

test('observer starts when entering a supported route and is inactive', () => {
  assert.equal(
    getObserverRouteAction({
      pathname: '/routes/library/tab/Favorites',
      observerActive: false,
      settings: settings(),
    }),
    'start',
  );
});

test('observer stays stopped when badges are disabled', () => {
  assert.equal(
    getObserverRouteAction({
      pathname: '/routes/library',
      observerActive: false,
      settings: settings({ disableBadges: true }),
    }),
    'noop',
  );
});

test('observer stops when badge display is effectively disabled by settings', () => {
  assert.equal(
    getObserverRouteAction({
      pathname: '/routes/library',
      observerActive: true,
      settings: settings({
        homePosition: BadgePosition.NONE,
        libraryPosition: BadgePosition.NONE,
      }),
    }),
    'stop',
  );
});
