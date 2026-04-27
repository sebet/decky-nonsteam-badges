import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getCapsuleBadgeClassKeys,
  getDetailsBadgePositionClassKey,
  getEffectiveCapsuleContext,
} from '../.test-dist/utils/badgePlacement.js';
import {
  BadgePosition,
  DEFAULT_SETTINGS,
} from '../.test-dist/types/settings.js';
import { GameStoreContext } from '../.test-dist/types/store.js';

function settings(overrides = {}) {
  return {
    ...DEFAULT_SETTINGS,
    ...overrides,
  };
}

test('home capsule uses the home badge style and configured home position', () => {
  assert.deepEqual(
    getCapsuleBadgeClassKeys(
      GameStoreContext.HOME,
      settings({ homePosition: BadgePosition.TOP_LEFT }),
    ),
    ['homeBadge', 'top-left'],
  );
});

test('library capsule uses the library badge style and configured library position', () => {
  assert.deepEqual(
    getCapsuleBadgeClassKeys(
      GameStoreContext.LIBRARY,
      settings({ libraryPosition: BadgePosition.BOTTOM_LEFT }),
    ),
    ['libraryBadge', 'bottom-left'],
  );
});

test('landscape library capsule is treated as search and uses the fixed search position', () => {
  const effectiveContext = getEffectiveCapsuleContext(
    GameStoreContext.LIBRARY,
    { width: 460, height: 215 },
  );

  assert.equal(effectiveContext, GameStoreContext.SEARCH);
  assert.deepEqual(
    getCapsuleBadgeClassKeys(
      effectiveContext,
      settings({ libraryPosition: BadgePosition.BOTTOM_LEFT }),
    ),
    ['searchBadge', 'search-top-right'],
  );
});

test('portrait library capsule stays in library context', () => {
  assert.equal(
    getEffectiveCapsuleContext(GameStoreContext.LIBRARY, {
      width: 215,
      height: 320,
    }),
    GameStoreContext.LIBRARY,
  );
});

test('details badge falls back to top-left when hidden but Steam Store button is enabled', () => {
  assert.equal(
    getDetailsBadgePositionClassKey(BadgePosition.NONE, true),
    'details-top-left',
  );
  assert.equal(
    getDetailsBadgePositionClassKey(BadgePosition.TOP_RIGHT, true),
    'details-top-right',
  );
});
